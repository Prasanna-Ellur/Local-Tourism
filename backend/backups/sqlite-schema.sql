CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'TOURIST',
    "phone" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "latitude" REAL,
    "longitude" REAL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE "Homestay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "providerId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pricePerNight" REAL NOT NULL,
    "checkInTime" TEXT NOT NULL DEFAULT '14:00',
    "checkOutTime" TEXT NOT NULL DEFAULT '11:00',
    "houseRules" TEXT,
    "amenities" TEXT NOT NULL,
    "maxGuests" INTEGER NOT NULL DEFAULT 2,
    "rating" REAL NOT NULL DEFAULT 5.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "latitude" REAL,
    "longitude" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Homestay_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Homestay_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "homestayId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "roomType" TEXT NOT NULL,
    "pricePerNight" REAL NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 2,
    "bedType" TEXT NOT NULL DEFAULT 'King Bed',
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Room_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "Homestay" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "HomestayImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "homestayId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HomestayImage_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "Homestay" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "TourGuide" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "providerId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "languages" TEXT NOT NULL,
    "yearsOfExperience" INTEGER NOT NULL DEFAULT 1,
    "specializations" TEXT NOT NULL,
    "pricePerDay" REAL NOT NULL,
    "pricePerHour" REAL,
    "rating" REAL NOT NULL DEFAULT 5.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TourGuide_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TourGuide_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "CulturalExperience" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "providerId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "durationHours" REAL NOT NULL DEFAULT 2.0,
    "price" REAL NOT NULL,
    "maxParticipants" INTEGER NOT NULL DEFAULT 10,
    "included" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 5.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CulturalExperience_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CulturalExperience_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "LocalBusiness" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "rating" REAL NOT NULL DEFAULT 5.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LocalBusiness_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LocalBusiness_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingReference" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingType" TEXT NOT NULL,
    "homestayId" TEXT,
    "roomId" TEXT,
    "tourGuideId" TEXT,
    "experienceId" TEXT,
    "checkInDate" DATETIME,
    "checkOutDate" DATETIME,
    "startDate" DATETIME,
    "numberOfGuests" INTEGER NOT NULL DEFAULT 1,
    "basePrice" REAL NOT NULL,
    "serviceFee" REAL NOT NULL DEFAULT 0.0,
    "taxes" REAL NOT NULL DEFAULT 0.0,
    "totalPrice" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "specialRequests" TEXT,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "cancelledAt" DATETIME,
    "cancellationReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Booking_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "Homestay" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Booking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Booking_tourGuideId_fkey" FOREIGN KEY ("tourGuideId") REFERENCES "TourGuide" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Booking_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "CulturalExperience" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT NOT NULL DEFAULT 'CARD',
    "paymentGateway" TEXT NOT NULL DEFAULT 'MOCK',
    "gatewayOrderId" TEXT,
    "gatewayPaymentId" TEXT,
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "homestayId" TEXT,
    "tourGuideId" TEXT,
    "experienceId" TEXT,
    "businessId" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "providerResponse" TEXT,
    "respondedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "Homestay" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Review_tourGuideId_fkey" FOREIGN KEY ("tourGuideId") REFERENCES "TourGuide" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Review_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "CulturalExperience" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Review_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "LocalBusiness" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "homestayId" TEXT,
    "roomId" TEXT,
    "tourGuideId" TEXT,
    "date" DATETIME NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Availability_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "Homestay" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Availability_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Availability_tourGuideId_fkey" FOREIGN KEY ("tourGuideId") REFERENCES "TourGuide" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE UNIQUE INDEX "Destination_slug_key" ON "Destination"("slug");
CREATE INDEX "Destination_slug_idx" ON "Destination"("slug");
CREATE INDEX "Destination_state_idx" ON "Destination"("state");
CREATE INDEX "Destination_isFeatured_idx" ON "Destination"("isFeatured");
CREATE UNIQUE INDEX "Homestay_slug_key" ON "Homestay"("slug");
CREATE INDEX "Homestay_providerId_idx" ON "Homestay"("providerId");
CREATE INDEX "Homestay_destinationId_idx" ON "Homestay"("destinationId");
CREATE INDEX "Homestay_pricePerNight_idx" ON "Homestay"("pricePerNight");
CREATE INDEX "Homestay_rating_idx" ON "Homestay"("rating");
CREATE INDEX "Room_homestayId_idx" ON "Room"("homestayId");
CREATE INDEX "HomestayImage_homestayId_idx" ON "HomestayImage"("homestayId");
CREATE INDEX "TourGuide_providerId_idx" ON "TourGuide"("providerId");
CREATE INDEX "TourGuide_destinationId_idx" ON "TourGuide"("destinationId");
CREATE INDEX "TourGuide_rating_idx" ON "TourGuide"("rating");
CREATE INDEX "CulturalExperience_providerId_idx" ON "CulturalExperience"("providerId");
CREATE INDEX "CulturalExperience_destinationId_idx" ON "CulturalExperience"("destinationId");
CREATE INDEX "CulturalExperience_category_idx" ON "CulturalExperience"("category");
CREATE INDEX "CulturalExperience_price_idx" ON "CulturalExperience"("price");
CREATE INDEX "LocalBusiness_providerId_idx" ON "LocalBusiness"("providerId");
CREATE INDEX "LocalBusiness_destinationId_idx" ON "LocalBusiness"("destinationId");
CREATE INDEX "LocalBusiness_category_idx" ON "LocalBusiness"("category");
CREATE UNIQUE INDEX "Booking_bookingReference_key" ON "Booking"("bookingReference");
CREATE INDEX "Booking_bookingReference_idx" ON "Booking"("bookingReference");
CREATE INDEX "Booking_userId_idx" ON "Booking"("userId");
CREATE INDEX "Booking_homestayId_idx" ON "Booking"("homestayId");
CREATE INDEX "Booking_roomId_idx" ON "Booking"("roomId");
CREATE INDEX "Booking_tourGuideId_idx" ON "Booking"("tourGuideId");
CREATE INDEX "Booking_experienceId_idx" ON "Booking"("experienceId");
CREATE INDEX "Booking_status_idx" ON "Booking"("status");
CREATE INDEX "Booking_paymentStatus_idx" ON "Booking"("paymentStatus");
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "Payment"("bookingId");
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");
CREATE INDEX "Payment_transactionId_idx" ON "Payment"("transactionId");
CREATE INDEX "Payment_status_idx" ON "Payment"("status");
CREATE INDEX "Review_userId_idx" ON "Review"("userId");
CREATE INDEX "Review_targetType_idx" ON "Review"("targetType");
CREATE INDEX "Review_homestayId_idx" ON "Review"("homestayId");
CREATE INDEX "Review_tourGuideId_idx" ON "Review"("tourGuideId");
CREATE INDEX "Review_experienceId_idx" ON "Review"("experienceId");
CREATE INDEX "Review_businessId_idx" ON "Review"("businessId");
CREATE INDEX "Availability_homestayId_date_idx" ON "Availability"("homestayId", "date");
CREATE INDEX "Availability_tourGuideId_date_idx" ON "Availability"("tourGuideId", "date");
CREATE UNIQUE INDEX "Availability_roomId_date_key" ON "Availability"("roomId", "date");
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE INDEX "Category_type_idx" ON "Category"("type");
CREATE INDEX "Category_slug_idx" ON "Category"("slug");
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");
