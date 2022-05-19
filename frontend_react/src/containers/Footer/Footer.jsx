import { useState, useCallback } from "react";
import { images } from "../../constants";
import { AppWrap, MotionWrap } from "../../wrapper";
import { client } from "../../client";
import "./Footer.scss";
// import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";

const Footer = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(true);

    const { username, email, message } = formData;

    const handleChangeInput = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const sendEmail = async () => {
        const templateParams = {
            to_name: "Juanjo",
            email: formData.email,
            message: formData.message,
            from_name: formData.username,
            reply_to: formData.email,
        };

        console.log("[simulating] Sending email with: ");
        console.log({ templateParams });

        // emailjs.send(
        //     process.env.REACT_APP_EMAILJS_SERVICE_ID,
        //     process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        //     templateParams,
        //     process.env.REACT_APP_EMAILJS_PUBLIC_KEY
        // );
    };

    const handleSubmit = () => {
        setLoading(true);

        const contact = {
            _type: "contact",
            name: formData.username,
            email: formData.email,
            message: formData.message,
        };

        client
            .create(contact)
            .then(() => {
                setLoading(false);
                setIsFormSubmitted(true);
            })
            .catch(err =>
                console.log("Error creating contact in Sanity: ", err)
            );

        // prettier-ignore
        sendEmail()
            .catch(error => {
                console.log("SendEmail failed. Error: ", error);
            });
    };

    return (
        <>
            <h2 className='head-text'>Take a coffee & chat with me</h2>

            <div className='app__footer-cards'>
                <div className='app__footer-card '>
                    <img src={images.email} alt='email' />
                    <a href='mailto:juanjo@juanjoguirao.com' className='p-text'>
                        juanjo@juanjoguirao.com
                    </a>
                </div>
                <div className='app__footer-card'>
                    <img src={images.mobile} alt='phone' />
                    <a href='tel:+44 (0)7747-078018' className='p-text'>
                        +44 (0)7747-078018
                    </a>
                </div>
            </div>
            {!isFormSubmitted ? (
                <div className='app__footer-form app__flex'>
                    <div className='app__flex'>
                        <input
                            className='p-text'
                            type='text'
                            placeholder='Your Name'
                            name='username'
                            value={username}
                            onChange={handleChangeInput}
                        />
                    </div>
                    <div className='app__flex'>
                        <input
                            className='p-text'
                            type='email'
                            placeholder='Your Email'
                            name='email'
                            value={email}
                            onChange={handleChangeInput}
                        />
                    </div>
                    <div>
                        <textarea
                            className='p-text'
                            placeholder='Your Message'
                            value={message}
                            name='message'
                            onChange={handleChangeInput}
                        />
                    </div>

                    <ReCAPTCHA
                        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                        onChange={() => setDisableSubmit(false)}
                    />

                    <button
                        type='button'
                        className='p-text'
                        onClick={handleSubmit}
                        disabled={disableSubmit}
                    >
                        {!loading ? "Send Message" : "Sending..."}
                    </button>
                </div>
            ) : (
                <div>
                    <h3 className='head-text'>
                        Thank you for getting in touch!
                    </h3>
                </div>
            )}
        </>
    );
};

export default AppWrap(
    MotionWrap(Footer, "app__footer"),
    "contact",
    "app__whitebg"
);
