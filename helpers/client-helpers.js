var express = require('express');
const db = require('../config/connection')
const bcrypt = require('bcrypt')
var router = express.Router();
const collection = require('../config/collection');
const { ObjectId } = require('mongodb');

const client1 = [

    {
        ARTICLEID: 1,
        TRYHERE: "https://charpstar.se/FullStackTest/Images/1.jpg",
        status: "notselected",
        comment: null
    },
    {
        ARTICLEID: 2,
        TRYHERE: "https://charpstar.se/FullStackTest/Images/2.jpg",
        status: "notselected",
        comment: null
    },
    {
        ARTICLEID: 3,
        TRYHERE: "https://charpstar.se/FullStackTest/Images/3.jpg",
        status: "notselected",
        comment:null
    }



]
const client2 = [
    {
        ARTICLEID: 1,
        TRYHERE: "https://charpstar.se/FullStackTest/Images/4.jpeg",
        status: "notselected",
        comment: null
    },
    {
        ARTICLEID: 2,
        TRYHERE: "https://charpstar.se/FullStackTest/Images/5.jpeg",
        status: "notselected",
        comment: null
    },
    {
        ARTICLEID: 3,
        TRYHERE: "https://charpstar.se/FullStackTest/Images/6.jpeg",
        status: "notselected",
        comment: null
    }



]

module.exports = {

    dosignup: (userData) => {

        return new Promise(async (resolve, reject) => {
            let count = await db.get().collection(collection.USER_COLLECTION).find().count()

            if (count % 2 == 0) {
                userData.detail = client1
            } else {
                userData.detail = client2
            }
            console.log(userData);
            console.log("userData vNNu")
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data)
            })
        })

    },
    
    signup: (Email) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            let email = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: Email.Email });
            if (email) {
                response.status = true
                resolve(response)

            } else {
                resolve({ status: false })
            }
        })

    },


    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log(user);
                        response.user = user
                        response.userId = user._id
                        response.status = true
                        resolve(response)
                    } else {
                        resolve({ status: false })
                    }
                })
            } else {
                resolve({ status: false })
            }
        })
    },

    userDetails: (userId) => {
        return new Promise((resolve, reject) => {
            console.log(userId);
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: ObjectId(userId) }).then((data) => {
                console.log(data);
                resolve(data)
            })
        })
    },

    statusUpdate: (Id, userId) => {
        console.log(Id)
        console.log(typeof (Id))
        let id = parseInt(Id)
        console.log("dha")
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(userId), 'detail.ARTICLEID': id },
                {
                    $set: {
                        "detail.$.status": "YES"
                    }
                }).then((data) => {
                    console.log(data)
                    resolve(data)
                })
        })

    },


    commentUpdate: (Id, userId, comment) => {
        console.log(Id)

        console.log(typeof (Id))
        let id = parseInt(Id)
        console.log("dha")
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(userId), 'detail.ARTICLEID': id },
                {
                    $set: {
                        "detail.$.status": "NO",
                        "detail.$.comment": comment.Comment
                    }
                }).then((data) => {
                    console.log(data)
                    resolve(data)
                })
        })

    },


    //admin
    getUserdetail: () => {
        return new Promise(async (resolve, reject) => {
            let detail = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(detail)
        })
    }

}

