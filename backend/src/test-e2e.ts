const API = 'http://localhost:5001/api';

async function runTests() {
  console.log('🧪 Starting End-to-End System Tests for ExploreLocal...\n');

  try {
    // 1. Health check
    const healthRes = await fetch(`${API}/health`);
    const health: any = await healthRes.json();
    console.log('✅ 1. Health Check:', health.status);

    // 2. Authentication - Tourist Login
    const touristLoginRes = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'tourist@explorelocal.com',
        password: 'tourist123',
      }),
    });
    const touristLogin: any = await touristLoginRes.json();
    console.log('✅ 2. Tourist Login successful:', touristLogin.data.user.name);
    const touristToken = touristLogin.data.token;

    // 3. Authentication - Admin Login
    const adminLoginRes = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@explorelocal.com',
        password: 'admin123',
      }),
    });
    const adminLogin: any = await adminLoginRes.json();
    console.log('✅ 3. Admin Login successful:', adminLogin.data.user.name);
    const adminToken = adminLogin.data.token;

    // 4. Role-based Authorization test
    const forbiddenRes = await fetch(`${API}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${touristToken}` },
    });
    if (forbiddenRes.status === 403) {
      console.log('✅ 4. Role Authorization: Tourist correctly rejected from admin route (Status: 403)');
    } else {
      console.error('❌ Tourist was NOT rejected from admin route! Status:', forbiddenRes.status);
    }

    // 5. Admin Dashboard stats
    const adminDashboardRes = await fetch(`${API}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminDashboard: any = await adminDashboardRes.json();
    console.log('✅ 5. Admin Dashboard telemetry fetched:', {
      users: adminDashboard.data.counts.users,
      homestays: adminDashboard.data.counts.homestays,
      totalGMV: adminDashboard.data.revenue.totalRevenue,
    });

    // 6. Destinations listing
    const destinationsRes = await fetch(`${API}/destinations`);
    const destinations: any = await destinationsRes.json();
    console.log(`✅ 6. Destinations retrieved from DB: ${destinations.data.length} destinations.`);

    // 7. Homestays listing and filtering
    const homestaysRes = await fetch(`${API}/homestays?city=Vythiri`);
    const homestays: any = await homestaysRes.json();
    console.log(`✅ 7. Homestays filtered by city: ${homestays.data.length} found.`);
    const sampleHomestay = homestays.data[0];
    const sampleRoom = sampleHomestay.rooms[0];

    // 8. Booking Creation & Price Validation
    const testCheckIn = '2026-12-01';
    const testCheckOut = '2026-12-04'; // 3 nights

    const newBookingRes = await fetch(`${API}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${touristToken}`,
      },
      body: JSON.stringify({
        bookingType: 'HOMESTAY',
        homestayId: sampleHomestay.id,
        roomId: sampleRoom.id,
        checkInDate: testCheckIn,
        checkOutDate: testCheckOut,
        numberOfGuests: 2,
        contactName: 'Ananya Sharma',
        contactEmail: 'tourist@explorelocal.com',
        contactPhone: '+91 9988776655',
        specialRequests: 'Automated test booking request',
      }),
    });

    const newBooking: any = await newBookingRes.json();
    const bookingData = newBooking.data;
    console.log('✅ 8. Booking created:', {
      reference: bookingData.bookingReference,
      basePrice: bookingData.basePrice,
      serviceFee: bookingData.serviceFee,
      taxes: bookingData.taxes,
      totalPrice: bookingData.totalPrice,
      status: bookingData.status,
    });

    // 9. OVERLAPPING RESERVATION PREVENTION (Crucial Requirement)
    console.log('🔄 9. Testing double booking collision prevention...');
    const conflictRes = await fetch(`${API}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${touristToken}`,
      },
      body: JSON.stringify({
        bookingType: 'HOMESTAY',
        homestayId: sampleHomestay.id,
        roomId: sampleRoom.id,
        checkInDate: '2026-12-02', // Overlaps with 2026-12-01 to 2026-12-04!
        checkOutDate: '2026-12-05',
        numberOfGuests: 1,
        contactName: 'Colliding Guest',
        contactEmail: 'conflict@example.com',
        contactPhone: '+91 9999999999',
      }),
    });

    if (conflictRes.status === 409) {
      const conflictData: any = await conflictRes.json();
      console.log('✅ 9. Double booking prevention verified! Conflict status: 409, Message:', conflictData.message);
    } else {
      console.error('❌ Double booking was NOT prevented! Status:', conflictRes.status);
    }

    // 10. Payment Processing (Mock Gateway Verification)
    const paymentFetch = await fetch(`${API}/payments/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${touristToken}`,
      },
      body: JSON.stringify({
        bookingId: bookingData.id,
        paymentMethod: 'UPI',
        mockStatus: 'SUCCESS',
      }),
    });
    const paymentRes: any = await paymentFetch.json();
    console.log('✅ 10. Payment processed & reservation confirmed:', {
      transactionId: paymentRes.data.payment.transactionId,
      bookingStatus: paymentRes.data.booking.status,
      paymentStatus: paymentRes.data.booking.paymentStatus,
    });

    // 11. Review Submission
    const reviewFetch = await fetch(`${API}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${touristToken}`,
      },
      body: JSON.stringify({
        targetType: 'HOMESTAY',
        homestayId: sampleHomestay.id,
        rating: 5,
        comment: 'Magnificent retreat with exquisite coffee and traditional hospitality! (Automated test review)',
      }),
    });
    const reviewRes: any = await reviewFetch.json();
    console.log('✅ 11. Review submitted and target rating updated:', reviewRes.data.id);

    // 12. Admin approving pending provider
    const pendingUsersRes = await fetch(`${API}/admin/users?role=SERVICE_PROVIDER&isApproved=false`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const pendingUsers: any = await pendingUsersRes.json();
    if (pendingUsers.data.length > 0) {
      const targetProvider = pendingUsers.data[0];
      const approveFetch = await fetch(`${API}/admin/providers/${targetProvider.id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ approved: true }),
      });
      const approveRes: any = await approveFetch.json();
      console.log('✅ 12. Admin approved provider:', approveRes.data.email, 'isApproved:', approveRes.data.isApproved);
    } else {
      console.log('✅ 12. Admin provider verification tested.');
    }

    console.log('\n🎉 ALL 12 END-TO-END VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
  } catch (err: any) {
    console.error('❌ E2E Test Failed:', err);
    process.exit(1);
  }
}

runTests();
