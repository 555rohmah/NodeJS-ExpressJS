import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser("CONTOHRAHASIA"));
app.use(express.json());

app.get('/', (req, res) => {
    const name = req.signedCookies["login"];
    res.send(`Hello ${name}`);
});

app.post('/login', (req, res) => {
    const name = req.body.name;
    res.cookie("Login", name, { path: "/", signed: true });
    res.send(`Hello ${name}`);
});

test("Test Cookie Write", async() => {
    const response = await request(app).post("/login")
    .send({ name: "Rumi" });
    console.info(response.get("Set-Cookie"));
    expect(response.get("Set-Cookie").toString()).toContain("Rumi");
    expect(response.text).toBe("Hello Rumi");
});