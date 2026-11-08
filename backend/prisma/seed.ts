import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ExploreLocal database seeding...');

  // Clean existing tables (in reverse order of dependencies)
  await prisma.notification.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.homestayImage.deleteMany();
  await prisma.homestay.deleteMany();
  await prisma.tourGuide.deleteMany();
  await prisma.culturalExperience.deleteMany();
  await prisma.localBusiness.deleteMany();
  await prisma.category.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedProviderPassword = await bcrypt.hash('provider123', 10);
  const hashedTouristPassword = await bcrypt.hash('tourist123', 10);

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@explorelocal.com',
      passwordHash: hashedAdminPassword,
      name: 'ExploreLocal Admin',
      role: 'ADMIN',
      phone: '+91 9876543210',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      bio: 'Platform super administrator overseeing regional eco-tourism and cultural partnerships.',
      isApproved: true,
    },
  });

  const providerKerala = await prisma.user.create({
    data: {
      email: 'kerala.homestay@explorelocal.com',
      passwordHash: hashedProviderPassword,
      name: 'Varghese Mathew',
      role: 'SERVICE_PROVIDER',
      phone: '+91 9447123456',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Coffee planter and passionate heritage host in Wayanad Western Ghats.',
      isApproved: true,
    },
  });

  const providerHimalayas = await prisma.user.create({
    data: {
      email: 'himalayan.host@explorelocal.com',
      passwordHash: hashedProviderPassword,
      name: 'Tenzin Wangchuk',
      role: 'SERVICE_PROVIDER',
      phone: '+91 9816012345',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      bio: 'High altitude mountaineer and mountain lodge keeper in Himachal Pradesh.',
      isApproved: true,
    },
  });

  const providerRajasthan = await prisma.user.create({
    data: {
      email: 'rajasthan.heritage@explorelocal.com',
      passwordHash: hashedProviderPassword,
      name: 'Rana Bhupender Singh',
      role: 'SERVICE_PROVIDER',
      phone: '+91 9829012345',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      bio: 'Guardian of 3rd generation sandstone haveli and Thar desert camel conservationist.',
      isApproved: true,
    },
  });

  const providerPending = await prisma.user.create({
    data: {
      email: 'pending.guide@explorelocal.com',
      passwordHash: hashedProviderPassword,
      name: 'Devraj Goswami',
      role: 'SERVICE_PROVIDER',
      phone: '+91 9831098765',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Aspiring cultural guide and folk artisan awaiting verification.',
      isApproved: false,
    },
  });

  const tourist = await prisma.user.create({
    data: {
      email: 'tourist@explorelocal.com',
      passwordHash: hashedTouristPassword,
      name: 'Ananya Sharma',
      role: 'TOURIST',
      phone: '+91 9988776655',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      bio: 'Travel photographer and architecture lover exploring authentic offbeat India.',
      isApproved: true,
    },
  });

  const tourist2 = await prisma.user.create({
    data: {
      email: 'arun.travels@explorelocal.com',
      passwordHash: hashedTouristPassword,
      name: 'Arun Verma',
      role: 'TOURIST',
      phone: '+91 9123456789',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
      bio: 'Slow traveler and food enthusiast looking for genuine local living experiences.',
      isApproved: true,
    },
  });

  // 2. Categories
  const categoriesData = [
    { name: 'Traditional Food & Cooking', slug: 'traditional-food', type: 'EXPERIENCE', icon: 'Utensils', description: 'Farm-to-table feasts, regional culinary workshops, and home dining.' },
    { name: 'Village & Farm Tours', slug: 'village-tours', type: 'EXPERIENCE', icon: 'Trees', description: 'Immersive rural walks, paddy field harvesting, and village artisan visits.' },
    { name: 'Handicrafts & Pottery', slug: 'handicrafts', type: 'EXPERIENCE', icon: 'Palette', description: 'Hands-on pottery wheels, block printing, and loom weaving.' },
    { name: 'Heritage & Storytelling', slug: 'heritage', type: 'EXPERIENCE', icon: 'Landmark', description: 'Monuments, ancient temple folklore, and night walking tours.' },
    { name: 'Nature & Trekking', slug: 'nature-trekking', type: 'EXPERIENCE', icon: 'Compass', description: 'Hidden waterfalls, bamboo rafting, tea garden mist walks.' },
    { name: 'Local Spices & Produce', slug: 'local-produce', type: 'BUSINESS', icon: 'ShoppingBag', description: 'Direct from source organic cardamom, pepper, and tea estates.' },
    { name: 'Artisan Handicrafts Store', slug: 'artisan-store', type: 'BUSINESS', icon: 'Store', description: 'Handmade terracotta, bell metal, and handwoven textiles.' },
    { name: 'Traditional Eatery', slug: 'traditional-eatery', type: 'BUSINESS', icon: 'Coffee', description: 'Century-old wood-fired kitchens serving family recipes.' },
    { name: 'Heritage Homestays', slug: 'heritage-homestays', type: 'HOMESTAY', icon: 'Home', description: 'Ancestral mansions, courtyard houses, and Havelis.' },
    { name: 'Eco Cottages & Treehouses', slug: 'eco-cottages', type: 'HOMESTAY', icon: 'Tent', description: 'Sustainable bamboo, mud-brick, and tree canopy residences.' },
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({ data: cat });
  }

  // 3. Destinations
  const destWayanad = await prisma.destination.create({
    data: {
      name: 'Wayanad',
      slug: 'wayanad',
      state: 'Kerala',
      region: 'Western Ghats',
      description: 'Lush evergreen rainforests, rolling mist-draped tea estates, ancient Neolithic Edakkal caves, and serene bamboo river rafting.',
      heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      ]),
      bestTimeToVisit: 'October to May',
      attractions: JSON.stringify(['Edakkal Caves', 'Banasura Sagar Dam', 'Chembra Peak', 'Kuruva Island Bamboo Rafts', 'Thirunelli Temple']),
      travelInfo: 'Nearest Airport: Calicut (CCJ) - 85 km. Nearest Railway: Kozhikode (CLT). Scenic mountain ghat road via Thamarassery.',
      latitude: 11.6854,
      longitude: 76.1320,
      isFeatured: true,
    },
  });

  const destManali = await prisma.destination.create({
    data: {
      name: 'Manali & Spiti Valley',
      slug: 'manali-spiti',
      state: 'Himachal Pradesh',
      region: 'Northern Himalayas',
      description: 'Towering snow-clad deodar forests, traditional Kath Kuni wooden architecture, apple orchards, and trans-Himalayan Tibetan monastery trails.',
      heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
      ]),
      bestTimeToVisit: 'March to June & September to November',
      attractions: JSON.stringify(['Old Manali Village', 'Hadimba Temple', 'Solang Valley', 'Key Monastery Spiti', 'Naggar Castle']),
      travelInfo: 'Nearest Airport: Kullu Bhuntar (KUU) - 50 km. Regular Volvo overnight coaches from New Delhi & Chandigarh.',
      latitude: 32.2432,
      longitude: 77.1892,
      isFeatured: true,
    },
  });

  const destJaisalmer = await prisma.destination.create({
    data: {
      name: 'Jaisalmer',
      slug: 'jaisalmer',
      state: 'Rajasthan',
      region: 'Thar Desert',
      description: 'The Golden City of Rajasthan crowned by Sonar Qila, carved yellow sandstone havelis, musical Manganiyar folk evenings, and serene desert stars.',
      heroImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=800&q=80',
      ]),
      bestTimeToVisit: 'October to March',
      attractions: JSON.stringify(['Jaisalmer Fort (Sonar Qila)', 'Patwon Ki Haveli', 'Sam Sand Dunes', 'Gadisar Lake', 'Kuldhara Ghost Village']),
      travelInfo: 'Jaisalmer Railway Station connected to Delhi and Jaipur. Jaisalmer Civil Airport operates winter seasonal flights.',
      latitude: 26.9157,
      longitude: 70.9083,
      isFeatured: true,
    },
  });

  const destCoorg = await prisma.destination.create({
    data: {
      name: 'Coorg (Kodagu)',
      slug: 'coorg',
      state: 'Karnataka',
      region: 'Southern Western Ghats',
      description: 'The Scotland of India, famed for fragrant shade-grown coffee plantations, pepper vines, cascading waterfalls, and Kodava warrior hospitality.',
      heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
      ]),
      bestTimeToVisit: 'October to April',
      attractions: JSON.stringify(['Abbey Falls', 'Raja Seat', 'Namdroling Golden Temple Bylakuppe', 'Mandalpatti Peak', 'Dubare Elephant Camp']),
      travelInfo: 'Nearest Airport: Kannur (CNN) - 80 km or Mangalore (IXE) - 130 km. 5 hours scenic drive from Bangalore.',
      latitude: 12.3375,
      longitude: 75.8069,
      isFeatured: true,
    },
  });

  const destHampi = await prisma.destination.create({
    data: {
      name: 'Hampi',
      slug: 'hampi',
      state: 'Karnataka',
      region: 'Deccan Plateau',
      description: 'An open-air museum of giant granite boulders, 14th-century Vijayanagara empire stone ruins, sacred Tungabhadra river bends, and coracle rides.',
      heroImage: 'https://images.unsplash.com/photo-1600100397608-f010e08e1e12?auto=format&fit=crop&w=1200&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600100397608-f010e08e1e12?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      ]),
      bestTimeToVisit: 'November to February',
      attractions: JSON.stringify(['Virupaksha Temple', 'Vittala Stone Chariot', 'Matanga Hill Sunset', 'Anegundi Village', 'Lotus Mahal']),
      travelInfo: 'Nearest Railway Station: Hospet (HPT) - 12 km. Direct trains from Bangalore, Hyderabad, and Goa.',
      latitude: 15.3350,
      longitude: 76.4600,
      isFeatured: false,
    },
  });

  // 4. Homestays & Rooms
  const homestayWayanad = await prisma.homestay.create({
    data: {
      providerId: providerKerala.id,
      destinationId: destWayanad.id,
      name: 'Vythiri Mist Eco Plantation Homestay',
      slug: 'vythiri-mist-eco-plantation',
      description: 'A 60-year-old eco-restored heritage timber bungalow nestled amid 40 acres of organic coffee and cardamom. Wake up to bird songs, sip freshly brewed estate filter coffee, and enjoy Kerala home-cooked sadya.',
      address: 'Old Vythiri Tea Estate Road, Post Box 14',
      city: 'Vythiri, Wayanad',
      state: 'Kerala',
      pricePerNight: 3400,
      checkInTime: '13:00',
      checkOutTime: '11:00',
      houseRules: 'Smoking inside rooms prohibited. Quiet hours after 10 PM. Traditional home-cooked meals served at communal dining table.',
      amenities: JSON.stringify(['Free Wi-Fi', 'Home Cooked Meals', 'Plantation Tour', 'Bonfire', 'Hot Water', 'Bird Watching Kit', 'Power Backup']),
      maxGuests: 6,
      rating: 4.9,
      reviewCount: 38,
      isAvailable: true,
      latitude: 11.5510,
      longitude: 76.0401,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', caption: 'Front porch view overlooking mist-veiled coffee slopes', isFeatured: true },
          { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', caption: 'Heritage teakwood bedroom suite with private garden veranda', isFeatured: false },
          { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', caption: 'Traditional clay-tiled courtyard and dining gazebo', isFeatured: false },
        ],
      },
      rooms: {
        create: [
          { name: 'Estate Heritage Suite', roomType: 'Heritage Suite', pricePerNight: 3400, capacity: 2, bedType: 'Carved King Bed', description: 'Traditional rosewood pillars, private open-air rain shower, and veranda.' },
          { name: 'Bamboo Garden Cottage', roomType: 'Private Cottage', pricePerNight: 2800, capacity: 2, bedType: 'Queen Bed', description: 'Surrounded by wild ginger and bamboo groves with sweeping valley panorama.' },
          { name: 'Family Loft Room', roomType: 'Family Suite', pricePerNight: 4500, capacity: 4, bedType: '1 King + 2 Twin Beds', description: 'Spacious upper attic with timber floorboards, books collection, and balcony.' },
        ],
      },
    },
  });

  const homestayManali = await prisma.homestay.create({
    data: {
      providerId: providerHimalayas.id,
      destinationId: destManali.id,
      name: 'Himalayan Cedar Wood Retreat',
      slug: 'himalayan-cedar-wood-retreat',
      description: 'Handcrafted traditional Kath Kuni stone and cedar wood home located in quiet Old Manali orchard. Features wood-burning bukhari stoves, panoramic views of snow-draped Rohtang pass, and warm Himachali hospitality.',
      address: 'Club House Road, Old Manali Village',
      city: 'Manali',
      state: 'Himachal Pradesh',
      pricePerNight: 2900,
      checkInTime: '12:00',
      checkOutTime: '10:00',
      houseRules: 'Remove footwear before stepping onto wood floors. Pet friendly. Outdoor bonfire subject to weather.',
      amenities: JSON.stringify(['Mountain View Balcony', 'Bukhari Heating', 'Organic Apple Orchard', 'High-Speed Wi-Fi', 'Hot Showers', 'Home Kitchen']),
      maxGuests: 8,
      rating: 4.8,
      reviewCount: 29,
      isAvailable: true,
      latitude: 32.2530,
      longitude: 77.1780,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', caption: 'Wooden chalet in snow-covered pine woods', isFeatured: true },
          { url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80', caption: 'Warm cedar wood bedroom with plush woolen quilts', isFeatured: false },
        ],
      },
      rooms: {
        create: [
          { name: 'Valley Peak Room', roomType: 'Deluxe Wood Room', pricePerNight: 2900, capacity: 2, bedType: 'King Bed', description: 'Floor to ceiling window frames snowy Himalayan peaks.' },
          { name: 'Apple Blossom Attic', roomType: 'Attic Suite', pricePerNight: 3500, capacity: 3, bedType: '1 King + 1 Daybed', description: 'Cozy slanted roof loft with wood stove and stargazing skylight.' },
        ],
      },
    },
  });

  const homestayJaisalmer = await prisma.homestay.create({
    data: {
      providerId: providerRajasthan.id,
      destinationId: destJaisalmer.id,
      name: 'Thar Royal Haveli Homestay',
      slug: 'thar-royal-haveli',
      description: 'Live inside the living golden fort ramparts. A 200-year-old Rajput haveli featuring intricate jali carvings, rooftop terrace overlooking Sonar Qila, and authentic Marwari thalis prepared by our family.',
      address: 'Near Jain Temples, Inside Golden Fort Ramparts',
      city: 'Jaisalmer',
      state: 'Rajasthan',
      pricePerNight: 2600,
      checkInTime: '12:00',
      checkOutTime: '11:00',
      houseRules: 'Vegetarian cooking preferred inside living quarters. Sunset rooftop viewing complimentary for guests.',
      amenities: JSON.stringify(['Fort View Rooftop', 'Authentic Marwari Dining', 'Camel Safari Desk', 'Free Wi-Fi', 'Air Conditioning', 'Ayurvedic Tea']),
      maxGuests: 4,
      rating: 4.9,
      reviewCount: 42,
      isAvailable: true,
      latitude: 26.9124,
      longitude: 70.9127,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80', caption: 'Golden sandstone jharokha balcony overlooking fort walls', isFeatured: true },
          { url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80', caption: 'Heritage room with block printed tapestries and brass lamps', isFeatured: false },
        ],
      },
      rooms: {
        create: [
          { name: 'Jharokha Heritage Room', roomType: 'Heritage Balcony Room', pricePerNight: 2600, capacity: 2, bedType: 'Four Poster Queen Bed', description: 'Original stone filigree bay window with fort rampart view.' },
          { name: 'Maharaja Suite', roomType: 'Master Suite', pricePerNight: 3800, capacity: 2, bedType: 'Royal King Bed', description: 'Spacious sandstone alcoves, antique mirror work, and private sitting area.' },
        ],
      },
    },
  });

  const homestayCoorg = await prisma.homestay.create({
    data: {
      providerId: providerKerala.id,
      destinationId: destCoorg.id,
      name: 'Silver Brook Coffee Estate Stay',
      slug: 'silver-brook-coffee-estate',
      description: 'Set beside a babbling freshwater stream inside a lush 25-acre Robusta coffee plantation. Savor authentic Pandi curry, homemade passion fruit wines, and unhurried walks beneath towering silver oaks.',
      address: 'Kadagadal Village, Madikeri-Siddapur Road',
      city: 'Madikeri, Coorg',
      state: 'Karnataka',
      pricePerNight: 3200,
      checkInTime: '14:00',
      checkOutTime: '11:00',
      houseRules: 'Estate walk guides available on request. Please do not pick coffee beans or wild flowers without host.',
      amenities: JSON.stringify(['Stream Bathing Spot', 'Estate Nature Trails', 'Kodava Kitchen', 'Indoor Games', 'Pet Friendly', 'Free Parking']),
      maxGuests: 6,
      rating: 4.7,
      reviewCount: 24,
      isAvailable: true,
      latitude: 12.4200,
      longitude: 75.7400,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', caption: 'Colonial style tiled verandah bordering coffee shrubs', isFeatured: true },
        ],
      },
      rooms: {
        create: [
          { name: 'Robusta Stream Cottage', roomType: 'Cottage', pricePerNight: 3200, capacity: 2, bedType: 'King Bed', description: 'Direct audio of running brook water, wooden sit-out, and hammock.' },
        ],
      },
    },
  });

  // 5. Tour Guides
  const guideWayanad = await prisma.tourGuide.create({
    data: {
      providerId: providerKerala.id,
      destinationId: destWayanad.id,
      name: 'Manoj Kumar Kurichya',
      bio: 'Native indigenous naturalist belonging to the Kurichya community. Over 9 years guiding travelers across secret Shola forests, ancient tribal medicinal flora, and prehistoric petroglyphs at Edakkal.',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      languages: JSON.stringify(['English', 'Malayalam', 'Hindi', 'Tamil']),
      yearsOfExperience: 9,
      specializations: JSON.stringify(['Tribal Ethnobotany', 'Rainforest Birding', 'Cave Archaeology', 'Bamboo Crafting']),
      pricePerDay: 1800,
      pricePerHour: 350,
      rating: 4.9,
      reviewCount: 51,
      isAvailable: true,
    },
  });

  const guideManali = await prisma.tourGuide.create({
    data: {
      providerId: providerHimalayas.id,
      destinationId: destManali.id,
      name: 'Tenzin Norbu',
      bio: 'Certified wilderness first responder and mountaineer with 12 seasons of experience leading high altitude monastery expeditions, fossil hunts in Spiti, and snow leopard winter tracking.',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      languages: JSON.stringify(['English', 'Hindi', 'Tibetan', 'Pahari']),
      yearsOfExperience: 12,
      specializations: JSON.stringify(['Himalayan Trekking', 'Monastery Iconography', 'Alpine Photography', 'Wilderness Safety']),
      pricePerDay: 2400,
      pricePerHour: 450,
      rating: 5.0,
      reviewCount: 67,
      isAvailable: true,
    },
  });

  const guideJaisalmer = await prisma.tourGuide.create({
    data: {
      providerId: providerRajasthan.id,
      destinationId: destJaisalmer.id,
      name: 'Bhairav Singh Bhati',
      bio: 'Desert historian and storyteller tracing 800 years of Silk Route caravans and Rajput chivalry. Deep access into private family havelis and traditional Manganiyar musician settlements.',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      languages: JSON.stringify(['English', 'Hindi', 'Marwari', 'French']),
      yearsOfExperience: 11,
      specializations: JSON.stringify(['Sonar Qila Architecture', 'Desert Survival', 'Folk Music Trails', 'Stargazing Astrotourism']),
      pricePerDay: 2000,
      pricePerHour: 400,
      rating: 4.8,
      reviewCount: 44,
      isAvailable: true,
    },
  });

  // 6. Cultural Experiences
  const expWayanad = await prisma.culturalExperience.create({
    data: {
      providerId: providerKerala.id,
      destinationId: destWayanad.id,
      title: 'Traditional Malabar Claypot Cooking & Spice Farm Walk',
      description: 'Walk through organic spice slopes plucking fresh green cardamom pods, peppercorns, and wild ginger. Then head into an ancestral wood-fired kitchen to learn slow claypot fish curry or jackfruit stew, concluding with banana leaf sadya.',
      category: 'Traditional Food',
      location: 'Vythiri Spice Village, Wayanad',
      durationHours: 3.5,
      price: 1200,
      maxParticipants: 8,
      included: JSON.stringify(['Handpicked Spices Kit', 'All Cooking Ingredients', 'Full Multi-course Banana Leaf Lunch', 'Recipe Booklet']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
      ]),
      rating: 4.9,
      reviewCount: 31,
      isAvailable: true,
    },
  });

  const expManali = await prisma.culturalExperience.create({
    data: {
      providerId: providerHimalayas.id,
      destinationId: destManali.id,
      title: 'Ancient Kath Kuni Wood Carving & Temple Architecture Walk',
      description: 'Discover the earthquake-proof 1000-year-old architectural heritage of Himachal Pradesh. Meet master wood sculptors, carve your own miniature cedar amulet, and drink hot herbal kahwa tea in a 12th-century courtyard.',
      category: 'Handicrafts',
      location: 'Naggar & Old Manali Village',
      durationHours: 3.0,
      price: 1500,
      maxParticipants: 6,
      included: JSON.stringify(['Cedar Wood Chisel Tools', 'Raw Deodar Block for Keepsake', 'Herbal Kahwa & Snacks', 'Master Carver Guidance']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      ]),
      rating: 4.8,
      reviewCount: 19,
      isAvailable: true,
    },
  });

  const expJaisalmer = await prisma.culturalExperience.create({
    data: {
      providerId: providerRajasthan.id,
      destinationId: destJaisalmer.id,
      title: 'Sunset Dune Camel Caravan & Manganiyar Folk Fire Musical',
      description: 'Ride into non-touristic private sand dunes as the sun sets in molten gold. Sit under desert stars around acacia wood fire listening to hypnotic Kamaycha and Dholak songs by master Manganiyar folk singers with hot Dal Baati Churma.',
      category: 'Heritage',
      location: 'Khuri Remote Dunes, Jaisalmer',
      durationHours: 5.0,
      price: 2200,
      maxParticipants: 12,
      included: JSON.stringify(['Camel Caravan Ride', 'Live Desert Folk Music Session', 'Woodfire Dal Baati Churma Dinner', 'Blankets & Stargazing Telescope']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      ]),
      rating: 5.0,
      reviewCount: 56,
      isAvailable: true,
    },
  });

  // 7. Local Businesses
  const bizWayanad = await prisma.localBusiness.create({
    data: {
      providerId: providerKerala.id,
      destinationId: destWayanad.id,
      name: 'Malabar Spices & Forest Honey Collective',
      category: 'Local Spices & Produce',
      description: 'A 28-member farmer cooperative selling single-origin Tellicherry black pepper, organic green cardamom, wild cliff honey, and hand-pounded turmeric directly from Western Ghats growers.',
      address: 'Main Bazaar Road, Near Post Office, Sultan Bathery',
      phone: '+91 9447012399',
      email: 'coop@malabarspices.org',
      website: 'https://malabarspices.example.org',
      openingHours: '9:00 AM - 7:30 PM (Closed on Sundays)',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      ]),
      priceRange: '$$',
      isFeatured: true,
      rating: 4.8,
      reviewCount: 45,
    },
  });

  const bizManali = await prisma.localBusiness.create({
    data: {
      providerId: providerHimalayas.id,
      destinationId: destManali.id,
      name: 'Himachal Weavers Loom Guild',
      category: 'Artisan Handicrafts Store',
      description: 'Handwoven pure Kullu and Kinnauri merino wool shawls, traditional caps, yak wool blankets, and natural vegetable dyed stoles crafted by local women artisans on pit looms.',
      address: 'Mall Road Craft Complex, Manali',
      phone: '+91 9816045678',
      email: 'guild@himachalweavers.example.org',
      openingHours: '10:00 AM - 8:00 PM Daily',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
      ]),
      priceRange: '$$$',
      isFeatured: true,
      rating: 4.9,
      reviewCount: 62,
    },
  });

  const bizJaisalmer = await prisma.localBusiness.create({
    data: {
      providerId: providerRajasthan.id,
      destinationId: destJaisalmer.id,
      name: 'Sonar Kila Camel Leather & Stone Carvings',
      category: 'Artisan Handicrafts Store',
      description: 'Ethically crafted desert camel leather journals, antique brass lanterns, and miniature sandstone jali candleholders carved by families preserving fort traditions for generations.',
      address: 'Fort Kotri Lane 3, Jaisalmer Fort',
      phone: '+91 9829077665',
      openingHours: '9:30 AM - 9:00 PM Daily',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      ]),
      priceRange: '$$',
      isFeatured: false,
      rating: 4.7,
      reviewCount: 33,
    },
  });

  // 8. Sample Bookings & Payments
  const rooms = await prisma.room.findMany({ where: { homestayId: homestayWayanad.id } });
  const roomToBook = rooms[0];

  const now = new Date();
  const checkIn = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000); // 10 days ahead
  const checkOut = new Date(now.getTime() + 13 * 24 * 60 * 60 * 1000); // 13 days ahead

  const booking1 = await prisma.booking.create({
    data: {
      bookingReference: 'EL-2026-H101',
      userId: tourist.id,
      bookingType: 'HOMESTAY',
      homestayId: homestayWayanad.id,
      roomId: roomToBook.id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests: 2,
      basePrice: 10200, // 3 nights @ 3400
      serviceFee: 510,
      taxes: 1224,
      totalPrice: 11934,
      status: 'CONFIRMED',
      paymentStatus: 'SUCCESSFUL',
      specialRequests: 'Would love vegetarian Kerala breakfast and advice on morning birdwatching trails.',
      contactName: 'Ananya Sharma',
      contactEmail: 'tourist@explorelocal.com',
      contactPhone: '+91 9988776655',
      payment: {
        create: {
          transactionId: 'TXN-MOCK-987214',
          amount: 11934,
          currency: 'INR',
          status: 'SUCCESSFUL',
          paymentMethod: 'UPI',
          paymentGateway: 'MOCK',
          paidAt: new Date(),
        },
      },
    },
  });

  // Add availability block for the booked room
  let cur = new Date(checkIn);
  while (cur < checkOut) {
    await prisma.availability.create({
      data: {
        homestayId: homestayWayanad.id,
        roomId: roomToBook.id,
        date: new Date(cur),
        isBooked: true,
      },
    });
    cur.setDate(cur.getDate() + 1);
  }

  // Sample Experience Booking
  const booking2 = await prisma.booking.create({
    data: {
      bookingReference: 'EL-2026-E202',
      userId: tourist2.id,
      bookingType: 'EXPERIENCE',
      experienceId: expJaisalmer.id,
      startDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      numberOfGuests: 2,
      basePrice: 4400,
      serviceFee: 220,
      taxes: 528,
      totalPrice: 5148,
      status: 'CONFIRMED',
      paymentStatus: 'SUCCESSFUL',
      specialRequests: 'Vegetarian meals preferred.',
      contactName: 'Arun Verma',
      contactEmail: 'arun.travels@explorelocal.com',
      contactPhone: '+91 9123456789',
      payment: {
        create: {
          transactionId: 'TXN-MOCK-345891',
          amount: 5148,
          currency: 'INR',
          status: 'SUCCESSFUL',
          paymentMethod: 'CARD',
          paymentGateway: 'MOCK',
          paidAt: new Date(),
        },
      },
    },
  });

  // Sample Guide Booking (Pending)
  const booking3 = await prisma.booking.create({
    data: {
      bookingReference: 'EL-2026-G303',
      userId: tourist.id,
      bookingType: 'GUIDE',
      tourGuideId: guideManali.id,
      startDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
      numberOfGuests: 3,
      basePrice: 4800, // 2 days @ 2400
      serviceFee: 240,
      taxes: 576,
      totalPrice: 5616,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      specialRequests: 'Interested in Spiti monastery murals and photography vantage points.',
      contactName: 'Ananya Sharma',
      contactEmail: 'tourist@explorelocal.com',
      contactPhone: '+91 9988776655',
    },
  });

  // 9. Reviews
  await prisma.review.create({
    data: {
      userId: tourist.id,
      targetType: 'HOMESTAY',
      homestayId: homestayWayanad.id,
      rating: 5,
      comment: 'Staying at Vythiri Mist was the highlight of our Kerala journey. Mr. Varghese took us on an unforgettable morning coffee walk and the home-cooked appams were heavenly!',
      providerResponse: 'Thank you Ananya! It was our pleasure hosting you. Come back during monsoon for the stream waterfalls!',
      respondedAt: new Date(),
    },
  });

  await prisma.review.create({
    data: {
      userId: tourist2.id,
      targetType: 'GUIDE',
      tourGuideId: guideJaisalmer.id,
      rating: 5,
      comment: 'Bhairav knows every hidden nook inside Jaisalmer fort. His stories brought 800 years of desert history alive. Highly recommended!',
    },
  });

  await prisma.review.create({
    data: {
      userId: tourist.id,
      targetType: 'EXPERIENCE',
      experienceId: expWayanad.id,
      rating: 5,
      comment: 'The claypot cooking class was hands-on and so aromatic. The fresh green pepper plucked right off the vine tasted unlike anything from a supermarket.',
    },
  });

  // 10. Notifications
  await prisma.notification.create({
    data: {
      userId: tourist.id,
      title: 'Booking Confirmed: Vythiri Mist Eco Plantation',
      message: 'Your stay (Ref: EL-2026-H101) has been confirmed. Host contact: +91 9447123456.',
      type: 'BOOKING',
      link: '/bookings/my',
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: providerKerala.id,
      title: 'New Confirmed Reservation Received',
      message: 'Guest Ananya Sharma confirmed for 3 nights (Ref: EL-2026-H101). Total: ₹11,934.',
      type: 'BOOKING',
      link: '/provider/dashboard',
      isRead: false,
    },
  });

  console.log('✅ Seeding completed successfully!');
  console.log('Credentials Summary:');
  console.log('  Admin:    admin@explorelocal.com / admin123');
  console.log('  Provider: kerala.homestay@explorelocal.com / provider123');
  console.log('  Provider: himalayan.host@explorelocal.com / provider123');
  console.log('  Tourist:  tourist@explorelocal.com / tourist123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
