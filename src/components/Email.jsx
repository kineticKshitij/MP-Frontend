import emailjs from "@emailjs/browser";

export const sendOTP = async (email) => {
  if (!email || email.trim() === "") {
    console.error("sendOTP Error: Email is empty.");
    return { success: false, message: "Email is required." };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  localStorage.setItem("otp", otp);

  const templateParams = {
    to_name: "User",
    from_name: "Minor Project",
    to_email: email.trim(),
    otp: otp,
  };

  try {
    const response = await emailjs.send(
      "service_9gqbhfn",
      "template_5eu1boo",
      templateParams,
      "oazL-ZEsF5twNev1Y"
    );
    console.log("EmailJS Response:", response);
    return { success: true, message: "OTP sent to your email." };
  } catch (error) {
    console.error("EmailJS Error:", error);
    return {
      success: false,
      message: "Failed to send OTP. Please check your EmailJS settings.",
    };
  }
};
