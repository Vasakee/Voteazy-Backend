const axios = require('axios')
const User = require('../Model/AuthSchema')

async function verifyCitizen(citizenNumber, email) {
    try {
        const response = await axios.get(`https://registration-9784.onrender.com/api/${citizenNumber}`,)

        if (response.status === 200 && response.data) {

            const DOB = response.data.dateOfBirth

            const birthDate = new Date(DOB);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
                console.log(age)
            }
            console.log('Citizen Details:', response.data)
            console.log('Email from API:', response.data.email)
            console.log('Email from user:', email)

            if (response.data.email !== email) {
                console.log('Email does not match')
                return { status: false, data: null, message: 'Email does not match' };
            }
            if (age < 18) {
                console.log('Citizen is not up to 18')
                return { status: false, data: null, message: 'Citizen is not up to 18' };
            } else if (response.data.email === email || age >= 18) {
                console.log(' Citizen details verified successful')
                return { status: true, data: response.data }
            }
        } else {
            throw new Error('Citizen not found')
        }
    } catch (error) {
        console.log('An error occured:', error.message)
        return { status: false, data: null, message: `An error occurred: ${error.message}` };
    }
}

async function isUserExisting(citizenNumber) {
    try {
        const user = await User.findOne({ citizenNumber: citizenNumber });
        return user !== null; // Return true if user exists, false otherwise
    } catch (error) {
        throw new Error('Error checking user existence');
    }
}

module.exports = { verifyCitizen, isUserExisting }


/*async function verifyCitizen(citizenNumber, email) {
    function calculateAge(dateOfBirth) {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    try {
        const response = await axios.get(https://registration-9784.onrender.com/api/${citizenNumber});



        if (response.status === 200 && response.data) {
            const { email: apiEmail, dateOfBirth } = response.data;

            const DOB = response.data.dateOfBirth

            const birthDate = new Date(dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
                console.log(age)
            }

            console.log('Citizen Details:', response.data);
            console.log('Email from API:', apiEmail);
            console.log('Email from user:', email);

            if (apiEmail !== email) {
                console.log('Email does not match');
                return false;
            }

            const age = calculateAge(dateOfBirth);
            console.log('Age:', age);

            if (age < 18) {
                throw new Error('Citizen is less than 18 years old');
            }

            console.log('Citizen details verified successfully.');
            return true;
        } else {
            console.log('Citizen not found or no data returned');
            return false;
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
        return false;
    }
}*/

