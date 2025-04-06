import emailjs from "@emailjs/browser";

export const sendOTP = async (email) => {
  if (!email || email.trim() === "") {
    alert("Email is required.");
    console.error("sendOTP Error: Email is empty.");
    return false;
  }

  console.log("Sending OTP to:", email); // Debugging step

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  localStorage.setItem("otp", otp);

  const templateParams = {
    to_name: "User",
    from_name: "Minor Project",
    to_email: email.trim(), // Ensure this matches the template
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
    alert("OTP sent to your email.");
    return true;
  } catch (error) {
    console.error("EmailJS Error:", error);
    alert("Failed to send OTP. Please check your EmailJS settings.");
    return false;
  }
};
