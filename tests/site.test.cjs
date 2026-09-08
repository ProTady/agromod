// Pruebas de los fallos corregidos. Ejecutar: node tests/site.test.cjs
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
// Sin fetch, almacenamiento ni DOM: preparar una solicitud no debe usar esos recursos.
const context = vm.createContext({URL, URLSearchParams, Intl});
for (const file of ["data.js","api.js"]) vm.runInContext(fs.readFileSync(path.join(root,"assets/js",file),"utf8"),context,{filename:file});
const api = vm.runInContext("AgroModAPI",context);
const payload = {name:"Prueba local",phone:"+51 900 000 001",crop:"Mandarina",hectares:"12.5",location:"Quipico, Sayán",service:"vuelos-multiespectrales",notes:"Revisar zona A & B"};
let passed = 0;
async function check(label,run) { await run(); passed++; console.log("OK " + label); }
(async () => {
  await check("Cada servicio genera un resumen con su nombre visible", async () => {
    for (const service of await api.getServices()) {
      const result = api.prepareQuote({...payload,service:service.id});
      assert.ok(result.message.includes("Servicio: " + service.title));
      assert.equal(result.data.service,service.id);
    }
  });
  await check("Incluye ubicación, teléfono, notas y hectáreas decimales", () => {
    const text = api.prepareQuote(payload).message;
    for (const detail of [payload.location,payload.phone,payload.notes,"12.5 ha"]) assert.ok(text.includes(detail));
  });
  await check("Editar conserva los datos nuevos y no reutiliza un resumen anterior", () => {
    api.prepareQuote(payload);
    const result = api.prepareQuote({...payload,hectares:18.75});
    assert.ok(result.message.includes("18.75 ha"));
    assert.ok(!result.message.includes("12.5 ha"));
    assert.equal(payload.hectares,"12.5");
  });
  await check("Rechaza servicios inexistentes y datos obligatorios vacíos", () => {
    for (const input of [{service:"desconocido"},{name:"   "},{location:" "},{crop:""}])
      assert.throws(() => api.prepareQuote({...payload,...input}));
  });
  await check("Rechaza superficies inválidas y acepta lotes menores a una hectárea", () => {
    for (const hectares of [0,-1,"",null,"NaN",Infinity,100001]) assert.throws(() => api.prepareQuote({...payload,hectares}));
    assert.equal(api.prepareQuote({...payload,hectares:.25}).data.hectares,.25);
  });
  await check("Rechaza teléfonos incompletos y texto no telefónico", () => {
    for (const phone of ["abc12345678","123","++++12345678","1234567890123456"])
      assert.throws(() => api.prepareQuote({...payload,phone}));
  });
  await check("No abre WhatsApp sin destinatario válido ni con el número de ejemplo", () => {
    assert.equal(api.getWhatsAppUrl("Prueba", ""),null);
    for (const number of ["","+51999999999","javascript:alert(1)","123","000000000"])
      assert.equal(api.getWhatsAppUrl("Prueba",number),null);
  });
  await check("Codifica el mensaje completo en un enlace HTTPS, sin enviarlo", () => {
    const message = api.prepareQuote(payload).message;
    const url = new URL(api.getWhatsAppUrl(message));
    assert.equal(url.origin,"https://wa.me");
    assert.equal(url.pathname,"/51944163763");
    assert.equal(url.searchParams.get("text"),message);
  });
  await check("Ordena artículos por fecha y busca sin depender de tildes", async () => {
    assert.equal((await api.getBlogPosts())[0].id,3);
    assert.ok((await api.getBlogPosts("all","evaluacion")).length > 0);
    assert.equal((await api.getBlogPosts("Tecnología de Campo"))[0].id,3);
    assert.equal((await api.getBlogPosts("all","zzzzzzz")).length,0);
  });
  await check("Conserva acceso a artículos por ID y slug, y maneja inexistentes", async () => {
    for (const post of await api.getBlogPosts()) assert.equal((await api.getPostById(post.slug)).id,post.id);
    assert.equal(await api.getPostById("desconocido"),null);
  });
  await check("Combina cultivo e índice sin mostrar muestras incorrectas", () => {
    assert.equal(api.getGallery().length,4);
    assert.equal(api.getGallery("citricos","NDRE").length,1);
    assert.equal(api.getGallery("paltos","NDRE").length,0);
    assert.equal(api.getGallery("paltos","RGB").length,1);
  });
  await check("Las páginas y catálogos referencian recursos locales existentes", async () => {
    for (const name of ["index.html","blog.html","post.html"]) {
      const html = fs.readFileSync(path.join(root,name),"utf8");
      for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
        if (/^(https?:|#)/.test(match[1])) continue;
        const file = match[1].split(/[?#]/)[0];
        assert.ok(fs.existsSync(path.join(root,file)),name + ": " + file);
      }
      assert.ok(!html.includes("cdn.tailwindcss.com"));
    }
    for (const item of [...api.getGallery(),...await api.getBlogPosts()]) assert.ok(fs.existsSync(path.join(root,item.image)));
  });
  console.log("\n" + passed + " comprobaciones correctas.");
})().catch(error => {console.error(error);process.exitCode=1;});
