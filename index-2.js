import puppeteer from "puppeteer";
import fs from "fs";

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const cookiesPath = "./cookies.json";
  if (fs.existsSync(cookiesPath)) {
    const cookiesString = fs.readFileSync(cookiesPath);
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
    console.log("Cookies cargadas");
  }

  await page.goto("https://web.telegram.org/", { waitUntil: "networkidle2" });

  if (!fs.existsSync(cookiesPath)) {
    console.log("Haz login manualmente...");
    await delay(600000); // Espera 10 minutos para login
    const newCookies = await page.cookies();
    fs.writeFileSync(cookiesPath, JSON.stringify(newCookies, null, 2));
    console.log("Cookies guardadas para futuros inicios");
  }

  // Buscar campo de búsqueda para chat y escribir nombre del contacto o chat
  await page.type(
    'input[data-testid="search-input"]',
    "Nombre o número del chat"
  );

  // Esperar que aparezca el chat y hacer click en el resultado (selector CSS aproximado)
  await page.waitForSelector(".chatlist-chat");
  await page.click(".chatlist-chat");

  // Esperar a que el cuadro de mensaje esté visible
  await page.waitForSelector('[data-testid="message-input"]');

  // Escribir el mensaje
  await page.type(
    '[data-testid="message-input"]',
    "¡Hola! Este mensaje fue enviado por un script."
  );

  // Pulsar Enter para enviar
  await page.keyboard.press("Enter");

  console.log("Mensaje enviado!");

  // Opcional: cerrar navegador
  // await browser.close();
})();
