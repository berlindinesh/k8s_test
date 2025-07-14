// import connectDB from "./config/db.js";
// import mongoose from "mongoose";
// import colors from 'colors'
// import dotenv from 'dotenv'
// import Profile from "./models/profileModels.js";
// import profiles from "./data/profiles.js";

// dotenv.config()
// connectDB()

// const importData=async()=>{
//     try{
//         Profile.deleteMany()
//         const createdProfiles = await Profile.insertMany(profiles)
//         console.log('Data Imported'.green.inverse)
//         process.exit(0)
//     }catch (error)
//     {
//         console.log(`${error}`.red.inverse)
//         process.exit(1)
//     }
// }

// const destroyData= async()=>{
//         try{
//             await Profile.deleteMany()
//             console.log('Data Destroyed!'.red.inverse)
//             process.exit(1)
//         }catch(error){
//             console.log(`${error}`.red.inverse)
//             process.exit(1)
//         }
// }

// if(process.argv[2]==="-d"){
//     destroyData()
// }else{
//     importData()
// }


// import mongoose from 'mongoose';
// import Contract from './models/contractModels.js';
// import Profile from './models/profileModels.js';
// import dotenv from 'dotenv';
// import connectDB from "./config/db.js";


// connectDB()
// dotenv.config();

// const seedContracts = async () => {
//   try {
//     const profiles = await Profile.find();
//     const contracts = profiles.map(profile => ({
//       employeeId: profile._id,
//       contractName: `${profile.name}'s Contract`,
//       startDate: new Date(),
//       endDate: null,
//       wageType: 'Monthly',
//       basicSalary: Math.floor(Math.random() * 50020) + 30000,
//       filingStatus: 'Single',
//       status: 'Active',
//     }));

//     await Contract.insertMany(contracts);
//     console.log('Contracts seeded successfully');
//     process.exit();
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

// seedContracts();
