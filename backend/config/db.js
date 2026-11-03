const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'quanly_datvexemphim'
});

connection.connect((err) => {
    if(err){
        console.log(err);
    }else{
        console.log('Kết nối MySQL thành công');
    }
});

module.exports = connection;