var express = require('express');
var router = express.Router();
var axios = require('axios');
var qs = require('qs');

const { SecureAuth } = require('saidp-sdk-js');
const { json } = require('express');
const api = new SecureAuth();
const jtw_decode = require('jwt-decode');


// AAPI Endpoint Section

router.post('/aapi/salesforce', function(req, res) {

    const options = {
             url: 'https://aapi.io/aapilet/secureauth-aapi/Salesforce-CreateAccountContact/play',
             method: 'get',
             headers: {
               apikey: '1426-78-GCSCDULL810P9EIBNAQ3FOSMYCPYRVNXDPOKYT11LAI'
             },
             params: {
                firstname: req.body.firstname, 
                lastname: req.body.lastname, 
                email: req.body.email
             }
        };

    axios(options).then(result => {
        console.log(result.data);
        res.json(result.data);
    }).catch(error => {
        console.log(error.response.data);
        res.json(error.response.data);
    });
});

// Test Section

router.get('/test', async function(req, res) {
    res.json('test');
})

// Titan and Twilight Mobile Service
router.get('/enrollment/Generate.QR/:id', async function(req, res) {

    const options = {
        url: 'https://us-services.secureauth.com/oauth/v1/token?grant_type=client_credentials',
        method: 'post',
        auth: {
            username: process.env.titanUser,
            password: process.env.titanPass,
            }
        };
    
         const resp = await axios(options);
         const decoded_token = jtw_decode(resp.data.access_token);

         console.log(decoded_token.domid);

         const data = {
             userId: req.params.id
         }
    
         const options2 = {
             url: 'https://' + decoded_token.domid + '.secureauth.com/mobilesvc/api/v1.0/enroll',
             method: 'post',
             headers: {
                'Authorization': 'Bearer ' +resp.data.access_token
            },
            data: data
         }
    
         const resp2 = await axios(options2);
    
         console.log(resp2.data);

         res.json(resp2.data);
})


router.post('/enrollment/validate/:id', async function(req, res) { 
    console.log(req.body);      // your JSON
    // {enrollmentCode: '', totp: ''}

    const options = {
        url: 'https://us-services.secureauth.com/oauth/v1/token?grant_type=client_credentials',
        method: 'post',
        auth: {
            username: process.env.titanUser,
            password: process.env.titanPass,
            }
        };
    
         const resp = await axios(options);
         const decoded_token = jtw_decode(resp.data.access_token);

         console.log(decoded_token.domid);

         const data = {
             enrollmentCode: req.body.enrollmentCode,
             totp: req.body.totp,
             userId: req.params.id
         }

         const options2 = {
            url: 'https://' + decoded_token.domid + '.secureauth.com/mobilesvc/api/v1.0/enroll/validate',
            method: 'post',
            headers: {
               'Authorization': 'Bearer ' +resp.data.access_token
           },
           data: data
        }
   
        axios(options2).then(result => {
            console.log(result.data);
            res.json(result.data);
        }).catch(error => {
            console.log(error.response.data);
            res.json(error.response.data);
        });

})

router.get('/user/:id/devices', async function(req, res) { 

    const options = {
        url: 'https://us-services.secureauth.com/oauth/v1/token?grant_type=client_credentials',
        method: 'post',
        auth: {
            username: process.env.titanUser,
            password: process.env.titanPass,
            }
        };
    
         const resp = await axios(options);
         const decoded_token = jtw_decode(resp.data.access_token);

         console.log(decoded_token.domid);

         const options2 = {
            url: 'https://' + decoded_token.domid + '.secureauth.com/mobilesvc/api/v1.0/user/'+req.params.id+'/devices',
            method: 'get',
            headers: {
               'Authorization': 'Bearer ' +resp.data.access_token
           }
        }

        axios(options2).then(result => {
            console.log(result.data);
            res.json(result.data);
        }).catch(error => {
            console.log(error.response.data);
            res.json(error.response.data);
        });

    })

    router.get('/delete/user/:id/devices/:idDevice', async function(req, res) { 

        axios.get('http://localhost:3001/api/user/'+req.params.id+'/devices').then(result => {
            const options = {
                url: 'https://us-services.secureauth.com/oauth/v1/token?grant_type=client_credentials',
                method: 'post',
                auth: {
                    username: process.env.titanUser,
                    password: process.env.titanPass,
                    }
                };
            
                 axios(options).then( resp => { 
                    const decoded_token = jtw_decode(resp.data.access_token);
            
                    console.log(decoded_token.domid);

                    result.data.forEach(element => {
                        const options2 = {
                            url: 'https://' + decoded_token.domid + '.secureauth.com/mobilesvc/api/v1.0/user/'+req.params.id+'/devices/'+element.enrollmentCode,
                            method: 'delete',
                            headers: {
                            'Authorization': 'Bearer ' +resp.data.access_token
                        }
                        }
                
                        axios(options2).then(result => {
                            console.log(result.data);
                            res.json(result.data);
                        }).catch(error => {
                            console.log(error.response.data);
                            res.json(error.response.data);
                        });
                    })
                })
        })

    })

// SecureAuth Endpoint Section

// POST Section

router.post('/validatecreds', function(req, res) {
    console.log(req.body);      // your JSON
    // {user: '', pwd: ''}
    api.auth.validatePassword(req.body.user, req.body.pwd).then(result => res.json(result)); 
  });

router.post('/validateemail', function(req, res) {
        console.log(req.body);
      api.auth.sendAdHocEmailOTP(req.body.user, req.body.email).then(result => res.json(result));
      //api.auth.sendAdHocSMSOTP('', req.body.phone).then(result => res.json(result));
});

router.post('/validatesms', function(req, res) {
    console.log(req.body);
  api.auth.sendAdHocSMSOTP(req.body.user, req.body.sms).then(result => res.json(result));
  //api.auth.sendAdHocSMSOTP('', req.body.phone).then(result => res.json(result));
});

router.post('/validatecall', function(req, res) {
    console.log(req.body);
  api.auth.sendAdHocPhoneCallOTP(req.body.user, req.body.call).then(result => res.json(result));
  //api.auth.sendAdHocSMSOTP('', req.body.phone).then(result => res.json(result));
});

router.post('/validatepushtoaccept', function(req, res) {
    console.log(req.body);
  //api.auth.sendPushAccept() //(req.body.user, req.body.call).then(result => res.json(result));
  //api.auth.sendAdHocSMSOTP('', req.body.phone).then(result => res.json(result));
});


router.post('/mfamethods', function(req, res) {
    api.profile.getUserMFAFactors(req.body.user).then(result => res.json(result));
});

// GET Section
router.get('/dfp', function(req,res) {
    console.log(req.body);      // your JSON
    // {user: '', email: ''}
    api.dfp.getDfpScript().then(result => res.json(result));
});

router.get('/user/:user/profile', function(req, res) {
    api.profile.getUserProfile(req.params.user).then(result => res.json(result));
});

router.get('/user/:user/mfamethods', function(req, res) {
    api.profile.getUserMFAFactors(req.params.user).then(result => res.json(result));
});

router.get('/user/:user', function(req, res) {    
    api.auth.validateUser(req.params.user).then(result => res.json(result));
});

router.get('/user/:user/pwd/:pwd', function(req, res) {    
    api.auth.validatePassword(req.params.user, req.params.pwd).then(result => res.json(result)); 
});


router.get('/user/:user/pwd/:pwd/reset', function(req, res) {    
    api.profile.idm.resetPassword(req.params.user, req.params.pwd).then(result => res.json(result)); 
});

router.get('/user/:user/phone/:phone', function(req, res) {
    api.auth.sendSMSOTP(req.params.user, req.params.phone).then(result => res.json(result));
});

router.get('/createuser', function(req, res) {
    let m = api.models;
    m.profileProperties.userId = 'test_user3';
    m.profileProperties.password = 'test';
    m.profileProperties.properties.firstName = 'Test';
    m.profileProperties.properties.lastName = 'User';
    m.profileProperties.properties.phone1 = '123-456-7890';
    m.profileProperties.properties.email1 = 'test@test.com';
    api.profile.idm.createUser(m.profileProperties).then(request => res.json(request));
});

module.exports = router;
