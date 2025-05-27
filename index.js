import { TelegramClient, Api } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input";

const apiId = 27574474;
const apiHash = "350d0de9c61ee6bf8ecac261daa41f7a";
const stringSession = new StringSession(
  "1AQAOMTQ5LjE1NC4xNzUuNTMBu5rpG3dJxP88M5Tp2rHLsh7Qq5YbzuSbt7t4C/nnwoVlcOVFF8wvXCHdmi6INR8G9CaEFJWkFdsUEzGqJ7J+507ryrIaPlxQBgIWiwtUQVzhZOq7I9Im0xMkPtsHpGUomM+AjfPGJVUokOD+biQ23X8+j+/Nr4WfkD9eMvfKCn4KShgcuObmWTNOOhwVuY0fM6j/QhtjaYTjQKj/ZwhGnV1k+wiMCHFxbma3v3jhlhk1EgJNPpjF4RjNVu4YSpbCyrzsq5fgHNgRJJbVMwywHg89Q6HATQ3ddBLSrI+jbZ5spAEbpnjYxOQxrMYjf42nKvmn5YzuvFfIP2a6AmlyPqA="
);

(async () => {
  console.log("Iniciando Telegram cliente...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Número de teléfono?"),
    password: async () => await input.text("Contraseña 2FA?"),
    phoneCode: async () => await input.text("Código que recibiste?"),
    onError: (err) => console.log(err),
  });

  console.log("✅ Sesión:", client.session.save());

  // Enviar mensaje
  const sentMessage = await client.sendMessage("me", {
    message: "No quiero generar conflictos ni malos entendidos. Encontre tu usuario por aca y decidi escribirte para que esto no avance mas. Te lo digo claro: ella esta saliendo de una etapa complicada y no se encuentra en un buen momento. Se perfectamente las cosas que decis sobre mi, y sinceramente te lo podes ahorrar. Hoy por hoy, las cosas entre nosotros estan bastante bien y no necesita tu ayuda. No me gustaria que empieces a llenarle la cabeza con ideas o confusiones, porque eso ya nos trajo varios problemas. Preferiria que no dijeras nada y que esta conversacion quede entre nosotros. Como te dije, no quiero mas conflictos, pero de todos modos voy a eliminar todo.",
  });
  console.log("📨 Mensaje enviado!", sentMessage.id);

  // Esperar 5 segundos y eliminarlo
  setTimeout(async () => {
    await client.deleteMessages("me", [sentMessage.id], { revoke: true });
    console.log("🗑️ Mensaje eliminado!");

    // Elegir a quién bloquear (username o ID)
    const userToBlock = await input.text("🔒 Usuario a bloquear (username o ID)?");

    // Obtener el usuario como entidad
    const entity = await client.getEntity(userToBlock);

    // Bloquear al usuario
    await client.invoke(new Api.contacts.Block({ id: entity }));
    console.log("🚫 Usuario bloqueado:", userToBlock);
  }, 5000);
})();
