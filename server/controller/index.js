import bycrpt from 'bcrypt';
import JWT from 'jsonwebtoken';

export const hashPassword = async (password) => {
    const salt = await bycrpt.genSalt(10);
    return await bycrpt.hash(password, salt);
}

export const comparePassword = async (password, userPassword) => {
    return await bycrpt.compare(password, userPassword);
}

export const createJWT = (id) => {
  return JWT.sign(
    {
      userId: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

export function getMonthName(index) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[index];
}
