-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'TOURIST',
    "phone" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "bestTimeToVisit" TEXT NOT NULL,
    "attractions" TEXT NOT NULL,
    "travelInfo" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Homestay" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pricePerNight" DOUBLE PRECISION NOT NULL,
    "checkInTime" TEXT NOT NULL DEFAULT '14:00',
    "checkOutTime" TEXT NOT NULL DEFAULT '11:00',
    "houseRules" TEXT,
    "amenities" TEXT NOT NULL,
    "maxGuests" INTEGER NOT NULL DEFAULT 2,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Homestay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "homestayId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "roomType" TEXT NOT NULL,
    "pricePerNight" DOUBLE PRECISION NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 2,
    "bedType" TEXT NOT NULL DEFAULT 'King Bed',
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomestayImage" (
    "id" TEXT NOT NULL,
    "homestayId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HomestayImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourGuide" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "languages" TEXT NOT NULL,
    "yearsOfExperience" INTEGER NOT NULL DEFAULT 1,
    "specializations" TEXT NOT NULL,
    "pricePerDay" DOUBLE PRECISION NOT NULL,
    "pricePerHour" DOUBLE PRECISION,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TourGuide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CulturalExperience" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "durationHours" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "price" DOUBLE PRECISION NOT NULL,
    "maxParticipants" INTEGER NOT NULL DEFAULT 10,
    "included" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CulturalExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalBusiness" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "openingHours" TEXT,
    "images" TEXT NOT NULL,
    "priceRange" TEXT NOT NULL DEFAULT '$$',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocalBusiness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "bookingReference" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingType" TEXT NOT NULL,
    "homestayId" TEXT,
    "roomId" TEXT,
    "tourGuideId" TEXT,
    "experienceId" TEXT,
    "checkInDate" TIMESTAMP(3),
    "checkOutDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "numberOfGuests" INTEGER NOT NULL DEFAULT 1,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "serviceFee" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "taxes" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "specialRequests" TEXT,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT NOT NULL DEFAULT 'CARD',
    "paymentGateway" TEXT NOT NULL DEFAULT 'MOCK',
    "gatewayOrderId" TEXT,
    "gatewayPaymentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "homestayId" TEXT,
    "tourGuideId" TEXT,
    "experienceId" TEXT,
    "businessId" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "providerResponse" TEXT,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "homestayId" TEXT,
    "roomId" TEXT,
    "tourGuideId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Destination_slug_key" ON "Destination"("slug");

-- CreateIndex
CREATE INDEX "Destination_slug_idx" ON "Destination"("slug");

-- CreateIndex
CREATE INDEX "Destination_state_idx" ON "Destination"("state");

-- CreateIndex
CREATE INDEX "Destination_isFeatured_idx" ON "Destination"("isFeatured");

-- CreateIndex
CREATE UNIQUE INDEX "Homestay_slug_key" ON "Homestay"("slug");

-- CreateIndex
CREATE INDEX "Homestay_providerId_idx" ON "Homestay"("providerId");

-- CreateIndex
CREATE INDEX "Homestay_destinationId_idx" ON "Homestay"("destinationId");

-- CreateIndex
CREATE INDEX "Homestay_pricePerNight_idx" ON "Homestay"("pricePerNight");

-- CreateIndex
CREATE INDEX "Homestay_rating_idx" ON "Homestay"("rating");

-- CreateIndex
CREATE INDEX "Room_homestayId_idx" ON "Room"("homestayId");

-- CreateIndex
CREATE INDEX "HomestayImage_homestayId_idx" ON "HomestayImage"("homestayId");

-- CreateIndex
CREATE INDEX "TourGuide_providerId_idx" ON "TourGuide"("providerId");

-- CreateIndex
CREATE INDEX "TourGuide_destinationId_idx" ON "TourGuide"("destinationId");

-- CreateIndex
CREATE INDEX "TourGuide_rating_idx" ON "TourGuide"("rating");

-- CreateIndex
CREATE INDEX "CulturalExperience_providerId_idx" ON "CulturalExperience"("providerId");

-- CreateIndex
CREATE INDEX "CulturalExperience_destinationId_idx" ON "CulturalExperience"("destinationId");

-- CreateIndex
CREATE INDEX "CulturalExperience_category_idx" ON "CulturalExperience"("category");

-- CreateIndex
CREATE INDEX "CulturalExperience_price_idx" ON "CulturalExperience"("price");

-- CreateIndex
CREATE INDEX "LocalBusiness_providerId_idx" ON "LocalBusiness"("providerId");

-- CreateIndex
CREATE INDEX "LocalBusiness_destinationId_idx" ON "LocalBusiness"("destinationId");

-- CreateIndex
CREATE INDEX "LocalBusiness_category_idx" ON "LocalBusiness"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingReference_key" ON "Booking"("bookingReference");

-- CreateIndex
CREATE INDEX "Booking_bookingReference_idx" ON "Booking"("bookingReference");

-- CreateIndex
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");

-- CreateIndex
CREATE INDEX "Booking_homestayId_idx" ON "Booking"("homestayId");

-- CreateIndex
CREATE INDEX "Booking_roomId_idx" ON "Booking"("roomId");

-- CreateIndex
CREATE INDEX "Booking_tourGuideId_idx" ON "Booking"("tourGuideId");

-- CreateIndex
CREATE INDEX "Booking_experienceId_idx" ON "Booking"("experienceId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_paymentStatus_idx" ON "Booking"("paymentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_transactionId_idx" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_targetType_idx" ON "Review"("targetType");

-- CreateIndex
CREATE INDEX "Review_homestayId_idx" ON "Review"("homestayId");

-- CreateIndex
CREATE INDEX "Review_tourGuideId_idx" ON "Review"("tourGuideId");

-- CreateIndex
CREATE INDEX "Review_experienceId_idx" ON "Review"("experienceId");

-- CreateIndex
CREATE INDEX "Review_businessId_idx" ON "Review"("businessId");

-- CreateIndex
CREATE INDEX "Availability_homestayId_date_idx" ON "Availability"("homestayId", "date");

-- CreateIndex
CREATE INDEX "Availability_tourGuideId_date_idx" ON "Availability"("tourGuideId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_roomId_date_key" ON "Availability"("roomId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_type_idx" ON "Category"("type");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- AddForeignKey
ALTER TABLE "Homestay" ADD CONSTRAINT "Homestay_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homestay" ADD CONSTRAINT "Homestay_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "Homestay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomestayImage" ADD CONSTRAINT "HomestayImage_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "Homestay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourGuide" ADD CONSTRAINT "TourGuide_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourGuide" ADD CONSTRAINT "TourGuide_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CulturalExperience" ADD CONSTRAINT "CulturalExperience_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CulturalExperience" ADD CONSTRAINT "CulturalExperience_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalBusiness" ADD CONSTRAINT "LocalBusiness_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalBusiness" ADD CONSTRAINT "LocalBusiness_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "Homestay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_tourGuideId_fkey" FOREIGN KEY ("tourGuideId") REFERENCES "TourGuide"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "CulturalExperience"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "Homestay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_tourGuideId_fkey" FOREIGN KEY ("tourGuideId") REFERENCES "TourGuide"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "CulturalExperience"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "LocalBusiness"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "Homestay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_tourGuideId_fkey" FOREIGN KEY ("tourGuideId") REFERENCES "TourGuide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
