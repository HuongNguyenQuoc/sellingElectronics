import dotenv from 'dotenv'; // Used for read files env
import { connectDB } from '../config/db';
import { User } from '../models/User'; // Model Users represent for collections users in MongoDB just like the table in SQL

dotenv.config(); // If without this, my code can don't understand process.env.MONGO_URI

const createAdmin = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL;

  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    existingAdmin.role = 'admin'; // just change in RAM if want to real change so need call .save()
    await existingAdmin.save(); // save into mongoDB
  } else {
    await User.create({
      userName: 'Admin',
      email,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
    });
  }

  process.exit(0); // Finish the script. Because this line just run once at time, so I don't want to server run agin and the number '0' means exit successfull, no error
};

createAdmin().catch(error => {
  console.error(error);
  process.exit(1); // The program exit because have error
});
