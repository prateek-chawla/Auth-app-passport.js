// const fetch = require('node-fetch')
// module.exports.verifyCaptcha = async (req, res, next) => {
//     console.log("*body****", req.body)

//     if (!req.body.captcha) {
//         console.log('empty captcha')
//         // req.captcha=false
//         req.flash('error', 'Please Select Captcha')
//         console.log(req.flash('error')[0])
//         // return res.redirect('/users/sign-in')
//         return res.json({ success: false, msg: "Please select captcha" });
//     }

// 		// Secret key
// 		const secretKey = "6Ld5daoZAAAAAEoQBI22H5VXmTxM7iALWocojIQv";

//         // Verify URL
//     const query=`secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`

// 		const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

// 		// Make a request to verifyURL
// 		const body = await fetch(verifyURL).then(res => res.json());

//         // If not successful
//     console.log(body)
//     if (body.success !== undefined && !body.success) {
//             // req.captcha = false;
//         req.flash('error', 'Failed Captcha Verification, Try Again')
//         // return res.redirect('back')
//         return res.json({ success: false, msg: "Please select captcha" });
//     }
//         // If successful
//     req.flash('captcha', 'Captcha Successful')
//     console.log('captcha controller ',req.flash('captcha'))
//         return res.json({ success: true, msg: "Captcha passed" });
//     // next()
// }


