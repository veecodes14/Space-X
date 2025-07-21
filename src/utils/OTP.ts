// Function to generate a secure 4-digit OTP
const generateOTP = () => {
    return String(Math.floor(Math.random() * 10000)).padStart(4, '0');
};

export default generateOTP;