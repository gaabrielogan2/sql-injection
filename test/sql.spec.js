const request = require('supertest');
const API_URL = process.env.API_URL;

describe('Product Price Modification', () => {
    it('SQL Injection', async () => {
        await request(API_URL)
            .get('/productdetails?productId=1; UPDATE products SET price=10 WHERE id=1 --')
            .set("Accept", "application/json")
            .then(response =>{
                expect(response.statusCode).toEqual(422); 
            });
    });

    it('SQL Injection - Informações do banco de dados', async () => {
        await request(API_URL)
            .get('/productdetails?productId=1 UNION SELECT table_name, column_name FROM information_schema.columns --')
            .set("Accept", "application/json")
            .then(response => {
                expect(response.statusCode).toEqual(422);
                
            });
    });

    it('SQL Injection - Exclusão de dados', async () => {
        await request(API_URL)
            .get('/productdetails?productId=1; DELETE FROM users WHERE id=1 --')
            .set("Accept", "application/json")
            .then(response => {
                expect(response.statusCode).toEqual(422);

            });
    });

    it('Tentativa de injeção de SQL na página de login', async () => {
        await request(API_URL)
            .post('/rest/user/login')
            .send({
                "email": "' OR 1=1 --",
                "password": "qualquer_senha"
            })
            .set("Accept", "application/json")
            .then(response => {
                expect(response.statusCode).toEqual(422); 
            });
    });
});
