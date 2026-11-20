-- ============================================================
-- ExploreLocal — Tourism Platform Database Export
-- Generated: 2026-11-11 19:28:49 IST
-- Source:    backend/prisma/dev.db  (SQLite 3)
-- ORM:       Prisma
-- ============================================================
-- To restore in SQLite:
--   sqlite3 new.db < db.sql
--
-- To migrate to PostgreSQL, see backend/prisma/schema.postgresql.prisma
-- and run: npx prisma migrate dev --name init
-- ============================================================


PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "User" (
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
INSERT INTO User VALUES('b61101e7-c4f3-4611-b865-4d816c5fee7d','admin@explorelocal.com','$2a$10$0GsPfZhd/z3f2XyDOaxOUuTP3KutVUJBNnxLXleilv5yzPR44NoHW','ExploreLocal Admin','ADMIN','+91 9876543210','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80','Platform super administrator overseeing regional eco-tourism and cultural partnerships.',1,1794135310534,1794135310534);
INSERT INTO User VALUES('d58287d0-8998-47c9-ae5c-2ce4e6544f28','kerala.homestay@explorelocal.com','$2a$10$2MmuaNu/AILnqtRm6/VriOsx9N5uw5GPNlFee489PhYbyMZrKbHtO','Varghese Mathew','SERVICE_PROVIDER','+91 9447123456','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80','Coffee planter and passionate heritage host in Wayanad Western Ghats.',1,1794135310536,1794135310536);
INSERT INTO User VALUES('783882f4-b2a0-483c-8100-850833182d7e','himalayan.host@explorelocal.com','$2a$10$2MmuaNu/AILnqtRm6/VriOsx9N5uw5GPNlFee489PhYbyMZrKbHtO','Tenzin Wangchuk','SERVICE_PROVIDER','+91 9816012345','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80','High altitude mountaineer and mountain lodge keeper in Himachal Pradesh.',1,1794135310537,1794135310537);
INSERT INTO User VALUES('d84b6e2b-7ff6-4b7e-ac0e-22770df06b9a','rajasthan.heritage@explorelocal.com','$2a$10$2MmuaNu/AILnqtRm6/VriOsx9N5uw5GPNlFee489PhYbyMZrKbHtO','Rana Bhupender Singh','SERVICE_PROVIDER','+91 9829012345','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80','Guardian of 3rd generation sandstone haveli and Thar desert camel conservationist.',1,1794135310537,1794135310537);
INSERT INTO User VALUES('16949f9d-9ca5-4dd5-9310-41f43f1e2fba','pending.guide@explorelocal.com','$2a$10$2MmuaNu/AILnqtRm6/VriOsx9N5uw5GPNlFee489PhYbyMZrKbHtO','Devraj Goswami','SERVICE_PROVIDER','+91 9831098765','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80','Aspiring cultural guide and folk artisan awaiting verification.',1,1794135310538,1794136649033);
INSERT INTO User VALUES('8dad3478-3783-4aa9-ae1e-425e6346f82a','tourist@explorelocal.com','$2a$10$X.EcsR6SHqGDj3EPu190x.KuBmjEGpiQg2pvdECrcM1Epf3oo/ZNm','Ananya Sharma','TOURIST','+91 9988776655','https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80','Travel photographer and architecture lover exploring authentic offbeat India.',1,1794135310538,1794135310538);
INSERT INTO User VALUES('6f76e31f-9907-40fc-b112-5a9fff094823','arun.travels@explorelocal.com','$2a$10$X.EcsR6SHqGDj3EPu190x.KuBmjEGpiQg2pvdECrcM1Epf3oo/ZNm','Arun Verma','TOURIST','+91 9123456789','https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80','Slow traveler and food enthusiast looking for genuine local living experiences.',1,1794135310539,1794135310539);
CREATE TABLE IF NOT EXISTS "Destination" (
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
INSERT INTO Destination VALUES('15235824-0037-4756-b1de-dd5ee4b8dfb0','Wayanad','wayanad','Kerala','Western Ghats','Lush evergreen rainforests, rolling mist-draped tea estates, ancient Neolithic Edakkal caves, and serene bamboo river rafting.','https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80','["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"]','October to May','["Edakkal Caves","Banasura Sagar Dam","Chembra Peak","Kuruva Island Bamboo Rafts","Thirunelli Temple"]','Nearest Airport: Calicut (CCJ) - 85 km. Nearest Railway: Kozhikode (CLT). Scenic mountain ghat road via Thamarassery.',11.6854,76.132,1,1794135310547,1794135310547);
INSERT INTO Destination VALUES('5bfc9fec-dc4e-4334-89e2-8d26a4f33867','Manali & Spiti Valley','manali-spiti','Himachal Pradesh','Northern Himalayas','Towering snow-clad deodar forests, traditional Kath Kuni wooden architecture, apple orchards, and trans-Himalayan Tibetan monastery trails.','https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80','["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80"]','March to June & September to November','["Old Manali Village","Hadimba Temple","Solang Valley","Key Monastery Spiti","Naggar Castle"]','Nearest Airport: Kullu Bhuntar (KUU) - 50 km. Regular Volvo overnight coaches from New Delhi & Chandigarh.',32.2432,77.1892,1,1794135310550,1794135310550);
INSERT INTO Destination VALUES('e335381e-cd07-49f2-84ea-cd5da6a37dd8','Jaisalmer','jaisalmer','Rajasthan','Thar Desert','The Golden City of Rajasthan crowned by Sonar Qila, carved yellow sandstone havelis, musical Manganiyar folk evenings, and serene desert stars.','https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80','["https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=800&q=80"]','October to March','["Jaisalmer Fort (Sonar Qila)","Patwon Ki Haveli","Sam Sand Dunes","Gadisar Lake","Kuldhara Ghost Village"]','Jaisalmer Railway Station connected to Delhi and Jaipur. Jaisalmer Civil Airport operates winter seasonal flights.',26.9157,70.9083,1,1794135310550,1794135310550);
INSERT INTO Destination VALUES('1dfcb4fe-9efd-48df-b12f-5301311efd6a','Coorg (Kodagu)','coorg','Karnataka','Southern Western Ghats','The Scotland of India, famed for fragrant shade-grown coffee plantations, pepper vines, cascading waterfalls, and Kodava warrior hospitality.','https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80','["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"]','October to April','["Abbey Falls","Raja Seat","Namdroling Golden Temple Bylakuppe","Mandalpatti Peak","Dubare Elephant Camp"]','Nearest Airport: Kannur (CNN) - 80 km or Mangalore (IXE) - 130 km. 5 hours scenic drive from Bangalore.',12.3375,75.8069,1,1794135310551,1794135310551);
INSERT INTO Destination VALUES('e82254f7-8b78-4175-b0f9-1e8ea3a24067','Hampi','hampi','Karnataka','Deccan Plateau','An open-air museum of giant granite boulders, 14th-century Vijayanagara empire stone ruins, sacred Tungabhadra river bends, and coracle rides.','https://images.unsplash.com/photo-1600100397608-f010e08e1e12?auto=format&fit=crop&w=1200&q=80','["https://images.unsplash.com/photo-1600100397608-f010e08e1e12?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80"]','November to February','["Virupaksha Temple","Vittala Stone Chariot","Matanga Hill Sunset","Anegundi Village","Lotus Mahal"]','Nearest Railway Station: Hospet (HPT) - 12 km. Direct trains from Bangalore, Hyderabad, and Goa.',15.335,76.46,0,1794135310552,1794135310552);
CREATE TABLE IF NOT EXISTS "Homestay" (
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
INSERT INTO Homestay VALUES('7468a496-b884-4d66-8024-127b5138c9e2','d58287d0-8998-47c9-ae5c-2ce4e6544f28','15235824-0037-4756-b1de-dd5ee4b8dfb0','Vythiri Mist Eco Plantation Homestay','vythiri-mist-eco-plantation','A 60-year-old eco-restored heritage timber bungalow nestled amid 40 acres of organic coffee and cardamom. Wake up to bird songs, sip freshly brewed estate filter coffee, and enjoy Kerala home-cooked sadya.','Old Vythiri Tea Estate Road, Post Box 14','Vythiri, Wayanad','Kerala',3400.0,'13:00','11:00','Smoking inside rooms prohibited. Quiet hours after 10 PM. Traditional home-cooked meals served at communal dining table.','["Free Wi-Fi","Home Cooked Meals","Plantation Tour","Bonfire","Hot Water","Bird Watching Kit","Power Backup"]',6,5.0,2,1,11.551,76.0401,1794135310554,1794136649024);
INSERT INTO Homestay VALUES('53edc46f-7eab-422d-8f95-5406e295f1f6','783882f4-b2a0-483c-8100-850833182d7e','5bfc9fec-dc4e-4334-89e2-8d26a4f33867','Himalayan Cedar Wood Retreat','himalayan-cedar-wood-retreat','Handcrafted traditional Kath Kuni stone and cedar wood home located in quiet Old Manali orchard. Features wood-burning bukhari stoves, panoramic views of snow-draped Rohtang pass, and warm Himachali hospitality.','Club House Road, Old Manali Village','Manali','Himachal Pradesh',2900.0,'12:00','10:00','Remove footwear before stepping onto wood floors. Pet friendly. Outdoor bonfire subject to weather.','["Mountain View Balcony","Bukhari Heating","Organic Apple Orchard","High-Speed Wi-Fi","Hot Showers","Home Kitchen"]',8,4.8,29,1,32.253,77.178,1794135310556,1794135310556);
INSERT INTO Homestay VALUES('a615c735-2e65-4953-8688-f8e88f16aec9','d84b6e2b-7ff6-4b7e-ac0e-22770df06b9a','e335381e-cd07-49f2-84ea-cd5da6a37dd8','Thar Royal Haveli Homestay','thar-royal-haveli','Live inside the living golden fort ramparts. A 200-year-old Rajput haveli featuring intricate jali carvings, rooftop terrace overlooking Sonar Qila, and authentic Marwari thalis prepared by our family.','Near Jain Temples, Inside Golden Fort Ramparts','Jaisalmer','Rajasthan',2600.0,'12:00','11:00','Vegetarian cooking preferred inside living quarters. Sunset rooftop viewing complimentary for guests.','["Fort View Rooftop","Authentic Marwari Dining","Camel Safari Desk","Free Wi-Fi","Air Conditioning","Ayurvedic Tea"]',4,4.9,42,1,26.9124,70.9127,1794135310559,1794135310559);
INSERT INTO Homestay VALUES('c4f770c5-7fc5-4986-84f9-ac878f3ef94d','d58287d0-8998-47c9-ae5c-2ce4e6544f28','1dfcb4fe-9efd-48df-b12f-5301311efd6a','Silver Brook Coffee Estate Stay','silver-brook-coffee-estate','Set beside a babbling freshwater stream inside a lush 25-acre Robusta coffee plantation. Savor authentic Pandi curry, homemade passion fruit wines, and unhurried walks beneath towering silver oaks.','Kadagadal Village, Madikeri-Siddapur Road','Madikeri, Coorg','Karnataka',3200.0,'14:00','11:00','Estate walk guides available on request. Please do not pick coffee beans or wild flowers without host.','["Stream Bathing Spot","Estate Nature Trails","Kodava Kitchen","Indoor Games","Pet Friendly","Free Parking"]',6,4.7,24,1,12.42,75.74,1794135310561,1794135310561);
INSERT INTO Homestay VALUES('7b317e5a-953e-427a-8cba-7cbc18632a80','d58287d0-8998-47c9-ae5c-2ce4e6544f28','1dfcb4fe-9efd-48df-b12f-5301311efd6a','prasanna Guest House','prasanna-guest-house-4394','You can enjoy so much here','near the water falls','kodagu','Karnataka',2000.0,'14:00','11:00',NULL,'["Free Wi-Fi","Home Cooked Meals","Plantation Walk","Hot Water"]',4,5.0,0,1,NULL,NULL,1794141706411,1794141706411);
CREATE TABLE IF NOT EXISTS "Room" (
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
INSERT INTO Room VALUES('50616c0f-986c-4635-9b42-af5e161d5257','7468a496-b884-4d66-8024-127b5138c9e2','Estate Heritage Suite','Traditional rosewood pillars, private open-air rain shower, and veranda.','Heritage Suite',3400.0,2,'Carved King Bed',1,1794135310554,1794135310554);
INSERT INTO Room VALUES('1b85a562-0af0-46a7-87f8-6260bddb2b5d','7468a496-b884-4d66-8024-127b5138c9e2','Bamboo Garden Cottage','Surrounded by wild ginger and bamboo groves with sweeping valley panorama.','Private Cottage',2800.0,2,'Queen Bed',1,1794135310554,1794135310554);
INSERT INTO Room VALUES('17962069-6429-4388-8bcf-56fbd7abc1a7','7468a496-b884-4d66-8024-127b5138c9e2','Family Loft Room','Spacious upper attic with timber floorboards, books collection, and balcony.','Family Suite',4500.0,4,'1 King + 2 Twin Beds',1,1794135310554,1794135310554);
INSERT INTO Room VALUES('856a3033-3f60-43bb-8f70-856a853b78cc','53edc46f-7eab-422d-8f95-5406e295f1f6','Valley Peak Room','Floor to ceiling window frames snowy Himalayan peaks.','Deluxe Wood Room',2900.0,2,'King Bed',1,1794135310556,1794135310556);
INSERT INTO Room VALUES('2a3fc901-df20-4106-bbdb-913ce9a49f53','53edc46f-7eab-422d-8f95-5406e295f1f6','Apple Blossom Attic','Cozy slanted roof loft with wood stove and stargazing skylight.','Attic Suite',3500.0,3,'1 King + 1 Daybed',1,1794135310556,1794135310556);
INSERT INTO Room VALUES('657e93ce-fdc2-49cf-a23d-daa52e07dc81','a615c735-2e65-4953-8688-f8e88f16aec9','Jharokha Heritage Room','Original stone filigree bay window with fort rampart view.','Heritage Balcony Room',2600.0,2,'Four Poster Queen Bed',1,1794135310559,1794135310559);
INSERT INTO Room VALUES('e1cb6944-ce52-4d2a-b6db-2b4046200340','a615c735-2e65-4953-8688-f8e88f16aec9','Maharaja Suite','Spacious sandstone alcoves, antique mirror work, and private sitting area.','Master Suite',3800.0,2,'Royal King Bed',1,1794135310559,1794135310559);
INSERT INTO Room VALUES('6d13e5eb-2ced-4cb7-8301-6b814f74a9ad','c4f770c5-7fc5-4986-84f9-ac878f3ef94d','Robusta Stream Cottage','Direct audio of running brook water, wooden sit-out, and hammock.','Cottage',3200.0,2,'King Bed',1,1794135310561,1794135310561);
INSERT INTO Room VALUES('f82b64e9-cdfb-4e45-8b0a-2a59f64abaed','7b317e5a-953e-427a-8cba-7cbc18632a80','Standard Heritage Room',NULL,'Deluxe Room',2000.0,4,'King Bed',1,1794141706411,1794141706411);
CREATE TABLE IF NOT EXISTS "HomestayImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "homestayId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HomestayImage_homestayId_fkey" FOREIGN KEY ("homestayId") REFERENCES "Homestay" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO HomestayImage VALUES('1a708ad2-a3fd-4e6d-a11a-3dc204610f25','7468a496-b884-4d66-8024-127b5138c9e2','https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80','Front porch view overlooking mist-veiled coffee slopes',1,1794135310554);
INSERT INTO HomestayImage VALUES('0acbb30b-d960-41cc-964c-d9b59b4d0e16','7468a496-b884-4d66-8024-127b5138c9e2','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80','Heritage teakwood bedroom suite with private garden veranda',0,1794135310554);
INSERT INTO HomestayImage VALUES('3a388b48-0b5c-479d-8384-03159148ff05','7468a496-b884-4d66-8024-127b5138c9e2','https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80','Traditional clay-tiled courtyard and dining gazebo',0,1794135310554);
INSERT INTO HomestayImage VALUES('74956459-ef0b-47ca-8055-8c5b753a3416','53edc46f-7eab-422d-8f95-5406e295f1f6','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80','Wooden chalet in snow-covered pine woods',1,1794135310556);
INSERT INTO HomestayImage VALUES('6c80cf79-45fa-47e4-9f15-69384ae23d17','53edc46f-7eab-422d-8f95-5406e295f1f6','https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80','Warm cedar wood bedroom with plush woolen quilts',0,1794135310556);
INSERT INTO HomestayImage VALUES('6ac94ea3-748e-4cf6-aa03-a769e270d04c','a615c735-2e65-4953-8688-f8e88f16aec9','https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80','Golden sandstone jharokha balcony overlooking fort walls',1,1794135310559);
INSERT INTO HomestayImage VALUES('467aeb2b-0771-4432-96d5-6cf645a5d8b8','a615c735-2e65-4953-8688-f8e88f16aec9','https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80','Heritage room with block printed tapestries and brass lamps',0,1794135310559);
INSERT INTO HomestayImage VALUES('056e24eb-e887-4036-830f-7232ff5e2c61','c4f770c5-7fc5-4986-84f9-ac878f3ef94d','https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80','Colonial style tiled verandah bordering coffee shrubs',1,1794135310561);
INSERT INTO HomestayImage VALUES('4f2560f6-c86f-491d-b2a1-0bd02d2a695a','7b317e5a-953e-427a-8cba-7cbc18632a80','https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',NULL,1,1794141706411);
CREATE TABLE IF NOT EXISTS "TourGuide" (
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
INSERT INTO TourGuide VALUES('731e12d7-995f-40d8-a5ef-682190fd6dfe','d58287d0-8998-47c9-ae5c-2ce4e6544f28','15235824-0037-4756-b1de-dd5ee4b8dfb0','Manoj Kumar Kurichya','Native indigenous naturalist belonging to the Kurichya community. Over 9 years guiding travelers across secret Shola forests, ancient tribal medicinal flora, and prehistoric petroglyphs at Edakkal.','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80','["English","Malayalam","Hindi","Tamil"]',9,'["Tribal Ethnobotany","Rainforest Birding","Cave Archaeology","Bamboo Crafting"]',1800.0,350.0,4.9,51,1,1794135310563,1794135310563);
INSERT INTO TourGuide VALUES('4678950d-a145-4246-8f32-7674b4ea0c8d','783882f4-b2a0-483c-8100-850833182d7e','5bfc9fec-dc4e-4334-89e2-8d26a4f33867','Tenzin Norbu','Certified wilderness first responder and mountaineer with 12 seasons of experience leading high altitude monastery expeditions, fossil hunts in Spiti, and snow leopard winter tracking.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80','["English","Hindi","Tibetan","Pahari"]',12,'["Himalayan Trekking","Monastery Iconography","Alpine Photography","Wilderness Safety"]',2400.0,450.0,5.0,67,1,1794135310564,1794135310564);
INSERT INTO TourGuide VALUES('25d6f87a-1f03-40fa-b587-795eeba305a3','d84b6e2b-7ff6-4b7e-ac0e-22770df06b9a','e335381e-cd07-49f2-84ea-cd5da6a37dd8','Bhairav Singh Bhati','Desert historian and storyteller tracing 800 years of Silk Route caravans and Rajput chivalry. Deep access into private family havelis and traditional Manganiyar musician settlements.','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80','["English","Hindi","Marwari","French"]',11,'["Sonar Qila Architecture","Desert Survival","Folk Music Trails","Stargazing Astrotourism"]',2000.0,400.0,4.8,44,1,1794135310564,1794135310564);
CREATE TABLE IF NOT EXISTS "CulturalExperience" (
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
INSERT INTO CulturalExperience VALUES('620fd63c-9be7-4536-a450-e747a7044f1d','d58287d0-8998-47c9-ae5c-2ce4e6544f28','15235824-0037-4756-b1de-dd5ee4b8dfb0','Traditional Malabar Claypot Cooking & Spice Farm Walk','Walk through organic spice slopes plucking fresh green cardamom pods, peppercorns, and wild ginger. Then head into an ancestral wood-fired kitchen to learn slow claypot fish curry or jackfruit stew, concluding with banana leaf sadya.','Traditional Food','Vythiri Spice Village, Wayanad',3.5,1200.0,8,'["Handpicked Spices Kit","All Cooking Ingredients","Full Multi-course Banana Leaf Lunch","Recipe Booklet"]','["https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80"]',4.9,31,1,1794135310565,1794135310565);
INSERT INTO CulturalExperience VALUES('64fc52bb-d9f0-4f81-8efb-c1ff4226d69a','783882f4-b2a0-483c-8100-850833182d7e','5bfc9fec-dc4e-4334-89e2-8d26a4f33867','Ancient Kath Kuni Wood Carving & Temple Architecture Walk','Discover the earthquake-proof 1000-year-old architectural heritage of Himachal Pradesh. Meet master wood sculptors, carve your own miniature cedar amulet, and drink hot herbal kahwa tea in a 12th-century courtyard.','Handicrafts','Naggar & Old Manali Village',3.0,1500.0,6,'["Cedar Wood Chisel Tools","Raw Deodar Block for Keepsake","Herbal Kahwa & Snacks","Master Carver Guidance"]','["https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"]',4.8,19,1,1794135310566,1794135310566);
INSERT INTO CulturalExperience VALUES('39990225-e72e-40d3-a85d-ff0ac081836f','d84b6e2b-7ff6-4b7e-ac0e-22770df06b9a','e335381e-cd07-49f2-84ea-cd5da6a37dd8','Sunset Dune Camel Caravan & Manganiyar Folk Fire Musical','Ride into non-touristic private sand dunes as the sun sets in molten gold. Sit under desert stars around acacia wood fire listening to hypnotic Kamaycha and Dholak songs by master Manganiyar folk singers with hot Dal Baati Churma.','Heritage','Khuri Remote Dunes, Jaisalmer',5.0,2200.0,12,'["Camel Caravan Ride","Live Desert Folk Music Session","Woodfire Dal Baati Churma Dinner","Blankets & Stargazing Telescope"]','["https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"]',5.0,56,1,1794135310566,1794135310566);
CREATE TABLE IF NOT EXISTS "LocalBusiness" (
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
INSERT INTO LocalBusiness VALUES('bbd7055f-59a0-457c-ba4a-c179e0ed31f1','d58287d0-8998-47c9-ae5c-2ce4e6544f28','15235824-0037-4756-b1de-dd5ee4b8dfb0','Malabar Spices & Forest Honey Collective','Local Spices & Produce','A 28-member farmer cooperative selling single-origin Tellicherry black pepper, organic green cardamom, wild cliff honey, and hand-pounded turmeric directly from Western Ghats growers.','Main Bazaar Road, Near Post Office, Sultan Bathery','+91 9447012399','coop@malabarspices.org','https://malabarspices.example.org','9:00 AM - 7:30 PM (Closed on Sundays)','["https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"]','$$',1,4.8,45,1794135310567,1794135310567);
INSERT INTO LocalBusiness VALUES('5a76bedb-dd8a-4376-bc08-3174f39542b5','783882f4-b2a0-483c-8100-850833182d7e','5bfc9fec-dc4e-4334-89e2-8d26a4f33867','Himachal Weavers Loom Guild','Artisan Handicrafts Store','Handwoven pure Kullu and Kinnauri merino wool shawls, traditional caps, yak wool blankets, and natural vegetable dyed stoles crafted by local women artisans on pit looms.','Mall Road Craft Complex, Manali','+91 9816045678','guild@himachalweavers.example.org',NULL,'10:00 AM - 8:00 PM Daily','["https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80"]','$$$',1,4.9,62,1794135310569,1794135310569);
INSERT INTO LocalBusiness VALUES('dc83a098-1950-4bf6-b8c8-10f26a37519b','d84b6e2b-7ff6-4b7e-ac0e-22770df06b9a','e335381e-cd07-49f2-84ea-cd5da6a37dd8','Sonar Kila Camel Leather & Stone Carvings','Artisan Handicrafts Store','Ethically crafted desert camel leather journals, antique brass lanterns, and miniature sandstone jali candleholders carved by families preserving fort traditions for generations.','Fort Kotri Lane 3, Jaisalmer Fort','+91 9829077665',NULL,NULL,'9:30 AM - 9:00 PM Daily','["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"]','$$',0,4.7,33,1794135310569,1794135310569);
CREATE TABLE IF NOT EXISTS "Booking" (
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
INSERT INTO Booking VALUES('69f66ae2-0f52-4f12-8e67-9aeced1f7e33','EL-2026-H101','8dad3478-3783-4aa9-ae1e-425e6346f82a','HOMESTAY','7468a496-b884-4d66-8024-127b5138c9e2','50616c0f-986c-4635-9b42-af5e161d5257',NULL,NULL,1794999310569,1795258510569,NULL,2,10200.0,510.0,1224.0,11934.0,'CANCELLED','REFUNDED','Would love vegetarian Kerala breakfast and advice on morning birdwatching trails.','Ananya Sharma','tourist@explorelocal.com','+91 9988776655',1794142829558,'Changed plans',1794135310571,1794142829559);
INSERT INTO Booking VALUES('5010619b-90e7-4044-af66-cd5648f1cf11','EL-2026-E202','6f76e31f-9907-40fc-b112-5a9fff094823','EXPERIENCE',NULL,NULL,NULL,'39990225-e72e-40d3-a85d-ff0ac081836f',NULL,NULL,1795431310569,2,4400.0,220.0,528.0,5148.0,'CONFIRMED','SUCCESSFUL','Vegetarian meals preferred.','Arun Verma','arun.travels@explorelocal.com','+91 9123456789',NULL,NULL,1794135310579,1794135310579);
INSERT INTO Booking VALUES('ab2c7a6c-6de0-42fa-b1ba-182427554b6f','EL-2026-G303','8dad3478-3783-4aa9-ae1e-425e6346f82a','GUIDE',NULL,NULL,'4678950d-a145-4246-8f32-7674b4ea0c8d',NULL,NULL,NULL,1795863310569,3,4800.0,240.0,576.0,5616.0,'CANCELLED','PENDING','Interested in Spiti monastery murals and photography vantage points.','Ananya Sharma','tourist@explorelocal.com','+91 9988776655',1794137822456,'Changed plans',1794135310580,1794137822457);
INSERT INTO Booking VALUES('eeeab2a0-33d6-4a3d-aa24-55cbdca2ddd2','EL-2026-H2549','8dad3478-3783-4aa9-ae1e-425e6346f82a','HOMESTAY','7468a496-b884-4d66-8024-127b5138c9e2','50616c0f-986c-4635-9b42-af5e161d5257',NULL,NULL,1796083200000,1796342400000,NULL,2,10200.0,510.0,1224.0,11934.0,'CANCELLED','REFUNDED','Automated test booking request','Ananya Sharma','tourist@explorelocal.com','+91 9988776655',1794137819825,'Changed plans',1794136648977,1794137819826);
INSERT INTO Booking VALUES('678ca783-1982-44ed-b5f1-890e0e124c47','EL-2026-H5778','8dad3478-3783-4aa9-ae1e-425e6346f82a','HOMESTAY','7b317e5a-953e-427a-8cba-7cbc18632a80','f82b64e9-cdfb-4e45-8b0a-2a59f64abaed',NULL,NULL,1794182400000,1794355200000,NULL,2,4000.0,200.0,480.0,4680.0,'CONFIRMED','SUCCESSFUL','','Ananya Sharma','tourist@explorelocal.com','+91 9988776655',NULL,NULL,1794141786675,1794141794251);
CREATE TABLE IF NOT EXISTS "Payment" (
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
INSERT INTO Payment VALUES('71316ca0-aa4a-4872-b0a5-7bfc1f3dd548','69f66ae2-0f52-4f12-8e67-9aeced1f7e33','TXN-MOCK-987214',11934.0,'INR','REFUNDED','UPI','MOCK',NULL,NULL,1794135310569,1794135310571,1794142829564);
INSERT INTO Payment VALUES('55103300-b334-4eab-958f-e976b3212524','5010619b-90e7-4044-af66-cd5648f1cf11','TXN-MOCK-345891',5148.0,'INR','SUCCESSFUL','CARD','MOCK',NULL,NULL,1794135310578,1794135310579,1794135310579);
INSERT INTO Payment VALUES('9c69f024-71bd-40ad-871f-4b19b5059508','eeeab2a0-33d6-4a3d-aa24-55cbdca2ddd2','TXN-649013-319673',11934.0,'INR','REFUNDED','UPI','MOCK',NULL,NULL,1794136649013,1794136649014,1794137819832);
INSERT INTO Payment VALUES('b696ae52-f031-4d7d-994e-b13de4aec726','678ca783-1982-44ed-b5f1-890e0e124c47','TXN-794247-933487',4680.0,'INR','SUCCESSFUL','UPI','MOCK',NULL,NULL,1794141794247,1794141794248,1794141794248);
CREATE TABLE IF NOT EXISTS "Review" (
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
INSERT INTO Review VALUES('830118b3-2af3-449f-b875-43ced17b9110','8dad3478-3783-4aa9-ae1e-425e6346f82a','HOMESTAY','7468a496-b884-4d66-8024-127b5138c9e2',NULL,NULL,NULL,5,'Staying at Vythiri Mist was the highlight of our Kerala journey. Mr. Varghese took us on an unforgettable morning coffee walk and the home-cooked appams were heavenly!','Thank you Ananya! It was our pleasure hosting you. Come back during monsoon for the stream waterfalls!',1794135310580,1794135310580,1794135310580);
INSERT INTO Review VALUES('0b93f79f-5728-412f-a554-66d50ba71461','6f76e31f-9907-40fc-b112-5a9fff094823','GUIDE',NULL,'25d6f87a-1f03-40fa-b587-795eeba305a3',NULL,NULL,5,'Bhairav knows every hidden nook inside Jaisalmer fort. His stories brought 800 years of desert history alive. Highly recommended!',NULL,NULL,1794135310581,1794135310581);
INSERT INTO Review VALUES('344d715a-ded3-4a81-9b7b-bb6a7ea02f46','8dad3478-3783-4aa9-ae1e-425e6346f82a','EXPERIENCE',NULL,NULL,'620fd63c-9be7-4536-a450-e747a7044f1d',NULL,5,'The claypot cooking class was hands-on and so aromatic. The fresh green pepper plucked right off the vine tasted unlike anything from a supermarket.',NULL,NULL,1794135310582,1794135310582);
INSERT INTO Review VALUES('aa1885c1-1c38-431c-bdc1-8fc64ae8036e','8dad3478-3783-4aa9-ae1e-425e6346f82a','HOMESTAY','7468a496-b884-4d66-8024-127b5138c9e2',NULL,NULL,NULL,5,'Magnificent retreat with exquisite coffee and traditional hospitality! (Automated test review)',NULL,NULL,1794136649022,1794136649022);
CREATE TABLE IF NOT EXISTS "Availability" (
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
INSERT INTO Availability VALUES('ce4a3133-0c7d-4d18-a7a7-6a313f984cbb','7b317e5a-953e-427a-8cba-7cbc18632a80','f82b64e9-cdfb-4e45-8b0a-2a59f64abaed',NULL,1794182400000,1,0,1794141794253);
INSERT INTO Availability VALUES('089c42d3-7d4a-4702-9c84-984ccd8eda4d','7b317e5a-953e-427a-8cba-7cbc18632a80','f82b64e9-cdfb-4e45-8b0a-2a59f64abaed',NULL,1794268800000,1,0,1794141794255);
CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO Category VALUES('3df28a49-4a3c-4a84-b3f8-f7b132d5b42b','Traditional Food & Cooking','traditional-food','Farm-to-table feasts, regional culinary workshops, and home dining.','Utensils','EXPERIENCE',1794135310539);
INSERT INTO Category VALUES('b2ef4759-4afa-424e-ad10-ba15dbefcde9','Village & Farm Tours','village-tours','Immersive rural walks, paddy field harvesting, and village artisan visits.','Trees','EXPERIENCE',1794135310543);
INSERT INTO Category VALUES('cc04e169-1291-4ac4-a6cc-9b3fce1786d1','Handicrafts & Pottery','handicrafts','Hands-on pottery wheels, block printing, and loom weaving.','Palette','EXPERIENCE',1794135310544);
INSERT INTO Category VALUES('ecb9a712-e168-45a9-8a93-410cf3ef7f47','Heritage & Storytelling','heritage','Monuments, ancient temple folklore, and night walking tours.','Landmark','EXPERIENCE',1794135310544);
INSERT INTO Category VALUES('21d0baf4-e3d5-42bd-a912-9b636a844790','Nature & Trekking','nature-trekking','Hidden waterfalls, bamboo rafting, tea garden mist walks.','Compass','EXPERIENCE',1794135310545);
INSERT INTO Category VALUES('a7f4c760-3132-44c5-bb44-711ddf66efc1','Local Spices & Produce','local-produce','Direct from source organic cardamom, pepper, and tea estates.','ShoppingBag','BUSINESS',1794135310545);
INSERT INTO Category VALUES('04f3a45a-cd24-4144-acf8-17753f26d072','Artisan Handicrafts Store','artisan-store','Handmade terracotta, bell metal, and handwoven textiles.','Store','BUSINESS',1794135310546);
INSERT INTO Category VALUES('8b6a04ed-8aef-4bb9-a7a1-e4ef0fbb12e2','Traditional Eatery','traditional-eatery','Century-old wood-fired kitchens serving family recipes.','Coffee','BUSINESS',1794135310546);
INSERT INTO Category VALUES('7597a043-a1a2-4e36-8f93-4d3e16505724','Heritage Homestays','heritage-homestays','Ancestral mansions, courtyard houses, and Havelis.','Home','HOMESTAY',1794135310546);
INSERT INTO Category VALUES('7bb2c041-9fd6-4cd5-8de7-6ead9538fdb9','Eco Cottages & Treehouses','eco-cottages','Sustainable bamboo, mud-brick, and tree canopy residences.','Tent','HOMESTAY',1794135310547);
CREATE TABLE IF NOT EXISTS "Notification" (
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
INSERT INTO Notification VALUES('e7d5465b-3244-43d8-a5c9-1ae99821113b','8dad3478-3783-4aa9-ae1e-425e6346f82a','Booking Confirmed: Vythiri Mist Eco Plantation','Your stay (Ref: EL-2026-H101) has been confirmed. Host contact: +91 9447123456.','BOOKING',0,'/bookings/my',1794135310582);
INSERT INTO Notification VALUES('c2638215-c9c6-4a9f-ab99-7282e23ad841','d58287d0-8998-47c9-ae5c-2ce4e6544f28','New Confirmed Reservation Received','Guest Ananya Sharma confirmed for 3 nights (Ref: EL-2026-H101). Total: ₹11,934.','BOOKING',0,'/provider/dashboard',1794135310583);
INSERT INTO Notification VALUES('bdcfaf7d-fd48-4def-a6f3-465ccc612567','d58287d0-8998-47c9-ae5c-2ce4e6544f28','New Reservation Request: EL-2026-H2549','Ananya Sharma booked Vythiri Mist Eco Plantation Homestay - Estate Heritage Suite (3 nights). Total: ₹11934. Please review and confirm.','BOOKING',0,'/provider/dashboard',1794136648993);
INSERT INTO Notification VALUES('67311de7-bea9-4d60-b4da-5c5e148df49b','8dad3478-3783-4aa9-ae1e-425e6346f82a','Payment Received: ₹11934','Your payment was successfully processed (Txn: TXN-649013-319673). Booking EL-2026-H2549 is confirmed!','PAYMENT',0,'/bookings/eeeab2a0-33d6-4a3d-aa24-55cbdca2ddd2',1794136649019);
INSERT INTO Notification VALUES('0e79dc53-1e4c-4bb5-9fd0-a07f7ba1251c','16949f9d-9ca5-4dd5-9310-41f43f1e2fba','Provider Account Approved! 🎉','Congratulations! Your service provider profile has been verified and approved by the ExploreLocal team. You can now publish listings.','SYSTEM',0,'/provider/dashboard',1794136649034);
INSERT INTO Notification VALUES('0ffceb1b-2c3d-4d66-ba11-0bb4b86ba9a4','8dad3478-3783-4aa9-ae1e-425e6346f82a','Booking Cancelled: EL-2026-H2549','Your booking EL-2026-H2549 has been successfully cancelled. Refund processed if applicable.','BOOKING',0,NULL,1794137819838);
INSERT INTO Notification VALUES('93c7edb6-ec06-47be-9c48-a7782c53a69e','8dad3478-3783-4aa9-ae1e-425e6346f82a','Booking Cancelled: EL-2026-G303','Your booking EL-2026-G303 has been successfully cancelled. Refund processed if applicable.','BOOKING',0,NULL,1794137822461);
INSERT INTO Notification VALUES('ea6645c1-5d46-4859-868f-43ba94187f9e','d58287d0-8998-47c9-ae5c-2ce4e6544f28','New Reservation Request: EL-2026-H5778','Ananya Sharma booked prasanna Guest House - Standard Heritage Room (2 nights). Total: ₹4680. Please review and confirm.','BOOKING',0,'/provider/dashboard',1794141786680);
INSERT INTO Notification VALUES('5cd17ab6-d4dd-4d80-ade0-a0341321f01e','8dad3478-3783-4aa9-ae1e-425e6346f82a','Payment Received: ₹4680','Your payment was successfully processed (Txn: TXN-794247-933487). Booking EL-2026-H5778 is confirmed!','PAYMENT',0,'/bookings/678ca783-1982-44ed-b5f1-890e0e124c47',1794141794256);
INSERT INTO Notification VALUES('ee34dd43-6f34-4b76-bf65-02477ab4f33c','8dad3478-3783-4aa9-ae1e-425e6346f82a','Booking Cancelled: EL-2026-H101','Your booking EL-2026-H101 has been successfully cancelled. Refund processed if applicable.','BOOKING',0,NULL,1794142829568);
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
COMMIT;
