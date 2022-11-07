import express from "express";
import request from "supertest";
import expressFileUpload from "express-fileupload";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressFileUpload());

app.post('/json', (req, res) => {
    const name = req.body.name;
    res.json({
        hello: `Hello ${name}`
    });
});

app.post('/form', (req, res) => {
    const name = req.body.name;
    res.json({
        hello: `Hello ${name}`
    });
});

app.post("/file", async(req, res) => {
    const texFile = req.files.article;
    await texFile.mv(__dirname + "/upload/" + texFile.name);

    res.send(`Hello ${req.body.name}, you uploaded ${texFile.name}`);
});

test("Test Request File Upload", async() => {
    const response = await request(app)
    .post("/file")
    .set("Content-Type", "multipart/form-data")
    .field("name", "Rumi")
    .attach("article", __dirname + "/contoh.txt");

    expect(response.text).toBe("Hello Rumi, you uploaded contoh.txt");
});

test("Test Request JSON", async() => {
    const response = await request(app)
    .post("/json")
    .set("Content-Type", "application/json")
    .send({ name: "World" });

    expect(response.body).toEqual({
        hello: `Hello World`
    });
});

test("Test Request Form", async() => {
    const response = await request(app)
    .post("/form")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .send("name=World");

    expect(response.body).toEqual({
        hello: `Hello World`
    });
});
