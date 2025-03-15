require("dotenv").config();

const Account = require("../src/models/Account"); // Adjust the path as necessary
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully!");
    seedBankData();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const seedBankData = async () => {
  const accounts = [
    {
      name: "Chase",
      imageUrl:
        "https://res.cloudinary.com/akshay74/image/upload/v1742022819/Montra/Bank%20Images/be8jcze3dtr02c7wkrnr.svg",
    },
    {
      name: "BCA",
      imageUrl:
        "https://res.cloudinary.com/akshay74/image/upload/v1742022819/Montra/Bank%20Images/waw89fzen6ak8jsm8h5m.svg",
    },
    {
      name: "Mandiri",
      imageUrl:
        "https://res.cloudinary.com/akshay74/image/upload/v1742022819/Montra/Bank%20Images/svjn6d0llbeilhnq8ouk.svg",
    },
    {
      name: "City Bank",
      imageUrl:
        "https://res.cloudinary.com/akshay74/image/upload/v1742022819/Montra/Bank%20Images/yrmv5qdycgq7xonwpjr1.svg",
    },
    {
      name: "Jago",
      imageUrl:
        "https://res.cloudinary.com/akshay74/image/upload/v1742022819/Montra/Bank%20Images/cnoitl3o3x2qkyabyeid.svg",
    },
    {
      name: "Bank of America",
      imageUrl:
        "https://res.cloudinary.com/akshay74/image/upload/v1742022819/Montra/Bank%20Images/zbqldzxltoozymbi06xf.svg",
    },
    {
      name: "Paypal",
      imageUrl:
        "https://res.cloudinary.com/akshay74/image/upload/v1742022820/Montra/Bank%20Images/fljnldllaxbgqruz2iwm.svg",
    },
    {
      name: "Wallet",
      imageUrl:
        "https://res.cloudinary.com/akshay74/image/upload/v1742031013/Montra/Bank%20Images/jviwglljrz8l0ztoimbt.svg",
    },
  ];

  try {
    await Account.deleteMany({});
    await Account.insertMany(accounts);
    console.log("Bank data seeded successfully!");
  } catch (error) {
    console.error("Error seeding bank data:", error);
  }
};

connectDB();
