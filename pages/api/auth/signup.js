// signup.js
import admin from '../../../configs/firebaseAdmin';
import { ROUTER } from '../../../constant/router';
import { addData } from '../../../helper/addData';
import { enableCors } from '../../../utils/enableCors';
import { passwordHash } from '../../../utils/passwordHash';

async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, username, fullname } = req.body ?? {};
    try {
      const hashPassword = await passwordHash(password);

      const userInfo = {
        email,
        password: hashPassword,
      };

      const customClaims = {
        username,
        fullname,
      };

      const userRecord = await admin.auth().createUser(userInfo);
      await admin.auth().setCustomUserClaims(userRecord.uid, customClaims);

      const addPassword = await addData(ROUTER.USERS_HASH_PASSWORD, userInfo);

      const user = {
        id: userRecord.uid,
        ...customClaims,
        ...addPassword,
      };

      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        error:
          'Could not create user! The password must be a string with at least 6 characters.',
      });
    }
  }
}

export default enableCors(handler);