function init(Sequelize, connection) {
    global.User = connection.define("user", {
        userType: {
            type: Sequelize.INTEGER
        },
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        password: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        phoneNo: {
            type: Sequelize.STRING
        },
        joinDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    })

    global.Manager = connection.define("manager", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        placeNm: {
            type: Sequelize.STRING(250)
        },
        placeAdd: {
            type: Sequelize.STRING(250)
        },
        placeNo: {
            type: Sequelize.INTEGER
        },
        placePhone: {
            type: Sequelize.STRING(20)
        },
        placeOpen: {
            type: Sequelize.STRING(5)
        },
        placeClose: {
            type: Sequelize.STRING(5)
        }
    })

    global.Reservation = connection.define("reserve", {
        date: {
            type: Sequelize.DATE
        },
        time: {
            type: Sequelize.STRING
        },
        carName: {
            type: Sequelize.STRING
        },
        reserveName: {
            type: Sequelize.STRING
        },
        reservePhone: {
            type: Sequelize.STRING
        },
        placeName: {
            type: Sequelize.STRING
        },
        placeAdd: {
            type: Sequelize.STRING
        },
        reserveState: {
            type: Sequelize.STRING,
            defaultValue: '예약대기'
        }
    })

    Manager.belongsTo(User, {
        as: "user",
        foreignKey: "id"
    })
    User.hasMany(Reservation, {
        as: "reserves",
        foreignKey: "userId"
    })




    connection.sync({
        alter: true
        //force: true
    })
}

// 만든함수 내보내기
module.exports = init