"""Genera las tres guías de ejecución de StockFlow (Linux, macOS y Windows) desde un solo texto.

Uso (desde la raíz del repositorio):
    python3 docs/guias/generar_guia_ejecucion.py

Cada paso se escribe una sola vez; lo que cambia entre sistemas se elige con s(linux, macos, windows).
Imprime con Chrome headless en dos pasadas (la segunda escribe los números de página del índice),
igual que docs/parciales/generar_pdf.py. Requiere google-chrome (o chromium) y pdftotext.
"""
import re
import sys
import tempfile
from html import escape
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parent.parent
sys.path.insert(0, str(AQUI.parent / "parciales"))
from generar_pdf import imprimir, paginas  # noqa: E402

SALIDAS = {
    "linux": [AQUI / "linux" / "guia-ejecucion-stockflow.pdf"],
    "macos": [AQUI / "macos" / "guia-ejecucion-stockflow-macos.pdf"],
    "windows": [AQUI / "windows" / "guia-ejecucion-stockflow-windows.pdf"],
}
FECHA = "19 de octubre de 2026"

SO = "linux"          # sistema que se está generando
INDICE: list[tuple[str, str, int]] = []   # (id, título, nivel)


def s(linux: str, macos: str | None = None, windows: str | None = None) -> str:
    """Texto según el sistema; macOS y Windows usan el de Linux si no se indica otro."""
    return {"linux": linux, "macos": macos if macos is not None else linux,
            "windows": windows if windows is not None else linux}[SO]


def ruta(*partes: str) -> str:
    base = s("~/Desktop/StockFlow", windows=r"C:\dev\StockFlow")
    sep = s("/", windows="\\")
    return sep.join([base, *partes])


def puerto(n: int) -> str:
    return s(f"ss -ltnp | grep {n}", f"lsof -nP -iTCP:{n} -sTCP:LISTEN", f"netstat -ano | findstr :{n}")


def configurar(sistema: str) -> None:
    """Fija el sistema y los textos que cambian con él (atajos de macOS, ruta del SDK…)."""
    global SO, CTRL, TERMINAL, ATAJO_TERMINAL, ATAJO_CLASE, ATAJO_ARCHIVO, ATAJO_ESTRUCTURA, ATAJO_RUN, \
        ATAJO_STOP, CONSOLA, SDK
    SO = sistema
    CTRL, TERMINAL = s("Ctrl", "Cmd"), s("la terminal", "la Terminal", "PowerShell")
    ATAJO_TERMINAL, ATAJO_CLASE = s("Alt+F12", "Option+F12"), s("Ctrl+N", "Cmd+O")
    ATAJO_ARCHIVO, ATAJO_ESTRUCTURA = s("Ctrl+Shift+N", "Cmd+Shift+O"), s("Ctrl+Alt+Shift+S", "Cmd+;")
    ATAJO_RUN, ATAJO_STOP, CONSOLA = s("Shift+F10", "Ctrl+R"), s("Ctrl+F2", "Cmd+F2"), s("F12", "Cmd+Option+I")
    SDK = s("~/Android/Sdk", "~/Library/Android/sdk", r"%LOCALAPPDATA%\Android\Sdk")


# --- piezas de HTML --------------------------------------------------------------------------

def cmd(*lineas: str) -> str:
    return '<pre class="cmd">' + "\n".join(escape(l) for l in lineas) + "</pre>"


def caja(clase: str, titulo: str, html: str) -> str:
    return f'<div class="caja {clase}"><div class="caja-t">{titulo}</div>{html}</div>'


def ver(html: str) -> str:
    return caja("ver", "✔ Qué deberías ver", html)


def falla(html: str) -> str:
    return caja("falla", "⚠ Si falla", html)


def entender(html: str) -> str:
    return caja("info", "ℹ Para entenderlo", html)


def nota(html: str) -> str:
    return f'<div class="nota">{html}</div>'


def tabla(cabeceras: list[str], filas: list[list[str]], clase: str = "") -> str:
    th = "".join(f"<th>{c}</th>" for c in cabeceras)
    tr = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in f) + "</tr>" for f in filas)
    return f'<table class="{clase}"><thead><tr>{th}</tr></thead><tbody>{tr}</tbody></table>'


def capitulo(ident: str, titulo: str, html: str = "") -> str:
    return f'<h2 id="{ident}" class="cap">{titulo}</h2>{html}'


def paso(ident: str, titulo: str, cuerpo: str, *cajas: str) -> str:
    return f'<section class="paso"><h3 id="{ident}">{titulo}</h3>{cuerpo}{"".join(cajas)}</section>'


def lista(*items: str, numerada: bool = True) -> str:
    tag = "ol" if numerada else "ul"
    return f"<{tag}>" + "".join(f"<li>{i}</li>" for i in items) + f"</{tag}>"


def c(texto: str) -> str:
    return f"<code>{escape(texto)}</code>"


# --- contenido ------------------------------------------------------------------------------

def portada() -> str:
    sistema = s("Cualquier Linux (Ubuntu, Debian, Fedora, Arch/CachyOS…) con Docker Engine o Docker Desktop, "
                "Java 21, Node.js y JetBrains Toolbox",
                "macOS (Apple Silicon o Intel) con Docker Desktop, Node.js y JetBrains Toolbox",
                "Windows 10 (22H2) u 11 de 64 bits con Docker Desktop (WSL 2), Node.js y JetBrains Toolbox")
    version = s("", "Versión para macOS", "Versión para Windows")
    aviso_movil = s(
        "Los mensajes de consola de esta guía se copiaron de un arranque real del proyecto en Linux "
        f"({FECHA}): base, backend, web y app móvil.",
        "Los mensajes del backend y de la web se copiaron de un arranque real; en macOS son iguales salvo las "
        "rutas. La app móvil se probó en Linux: los pasos propios de macOS (rutas del SDK, imagen arm64) siguen "
        "la documentación oficial de Android y Expo, sin haberse ejecutado en una Mac.",
        "Los mensajes del backend y de la web se copiaron de un arranque real; en Windows son iguales salvo las "
        "rutas. La app móvil se probó en Linux: los pasos propios de Windows (variables de entorno, WHPX) siguen "
        "la documentación oficial de Android y Expo, sin haberse ejecutado en Windows.")
    return f"""
<section class="portada">
  <div class="p-titulo">Guía de ejecución</div>
  <div class="p-sub">Cómo poner en marcha StockFlow, paso a paso</div>
  {f'<div class="p-version">{version}</div>' if version else ''}
  <div class="p-proy">StockFlow — Inventario, compras internas y movimientos de almacén (PA-06)</div>
  <div class="p-stack">Docker · PostgreSQL 16 · Spring Boot 3.5 · IntelliJ IDEA · DataGrip<br>
  React 19 · Vite 8 · WebStorm<br>Android Studio · Expo SDK 58 · React Native 0.88</div>
  {tabla([], [
      ["Para quién", "Cualquier integrante del equipo, sin experiencia previa en Docker, Spring Boot, React ni Android"],
      ["Sistema", sistema],
      ["Tiempo", "Primera vez: 60-90 minutos (incluye instalar; la app móvil suma unos 30) · Después: menos de 5 minutos"],
      ["Fecha", f"{FECHA} · rama Hector (backend, web y app móvil hasta la guía móvil 03)"],
  ], "ficha")}
  <p class="p-aviso">{aviso_movil}</p>
</section>"""


def antes_de_empezar() -> str:
    docker_donde = s("Docker Engine (<code>sudo systemctl start docker</code>) o Docker Desktop "
                     "(<code>systemctl --user start docker-desktop</code>)",
                     "Docker Desktop, se abre como cualquier aplicación (carpeta Aplicaciones)",
                     "Docker Desktop, se abre desde el menú Inicio (usa WSL 2)")
    return capitulo("antes", "1. Antes de empezar", f"""
<p>Esta guía te lleva, paso a paso, desde la computadora apagada hasta tener StockFlow funcionando: la base de
datos encendida, el backend respondiendo, la API probada, los datos visibles en DataGrip, la aplicación web abierta
en el navegador y la <b>app móvil</b> corriendo en un teléfono Android virtual.</p>
<p>No necesitas saber Docker, Spring Boot, React ni Android para seguirla. Cada paso dice qué hacer, el comando
exacto para copiar, qué deberías ver si salió bien y qué hacer si falla.
{s(" Sirve para cualquier distribución Linux: donde un comando cambia según la distribución, aparece una línea para "
   "Ubuntu/Debian, otra para Fedora y otra para Arch/CachyOS; ejecuta sólo la tuya.",
   " Está escrita para macOS.", " Está escrita para Windows; los comandos se escriben en PowerShell.")}</p>
<p>Hazla en orden la primera vez: la base y el backend (capítulo 3), la web (capítulo 4) y la app móvil
(capítulo 5). La web necesita al backend encendido; la app móvil, por ahora, no (ver el aviso del capítulo 5).
Para el uso diario alcanza con la rutina rápida del capítulo 7.</p>
<h4>Cómo leer cada paso</h4>
{cmd("Los bloques oscuros son comandos: cópialos tal cual en " + TERMINAL)}
{ver("Lo que aparece cuando el paso salió bien.")}
{falla("Qué hacer si ves otra cosa.")}
{entender("Por qué se hace así (opcional, pero útil para la defensa).")}
<h4>Las piezas del sistema</h4>
{tabla(["Pieza", "Qué es (en simple)", "Dónde vive"], [
    ["Docker", "Un programa que ejecuta otros programas dentro de “cajas” aisladas (contenedores). Lo usamos para no "
     "instalar PostgreSQL directamente en tu sistema.", docker_donde],
    ["PostgreSQL", "La base de datos: guarda categorías, productos, stock, movimientos…",
     "Contenedor <code>stockflow-postgres</code>, en <code>localhost:5432</code>"],
    ["Backend (Spring Boot)", "El programa Java que recibe las peticiones, aplica las reglas del negocio y lee o "
     "escribe en PostgreSQL.", "IntelliJ (<code>StockFlowApplication</code>), en <code>localhost:8080</code>"],
    ["Flyway", "Crea las tablas automáticamente al arrancar el backend, con los archivos V1, V2 y V3.",
     "<code>src/main/resources/db/migration</code>"],
    ["Frontend web (React + Vite)", "La aplicación web: menú, tablas y formularios. No guarda datos: se los pide al "
     "backend.", "<code>webstorm/stockflow-frontend</code>, con <code>npm run dev</code> en <code>localhost:5173</code>"],
    ["Node.js y npm", "Node.js ejecuta las herramientas de la web y del móvil (Vite, Expo, las pruebas). npm descarga "
     "sus librerías, como Maven en el backend.", "Instalados en tu sistema"],
    ["App móvil (React Native + Expo)", "La aplicación Android. Hoy muestra datos de ejemplo guardados en la propia "
     "app; se conectará al backend en la guía móvil 08.", "<code>androidstudio/stockflow-mobile</code>"],
    ["Android Studio y el emulador", "Instala el Android SDK y crea un teléfono virtual (AVD) donde corre la app. "
     "<code>adb</code> es el comando que habla con ese teléfono.", f"SDK en <code>{SDK}</code>"],
    ["Metro y Expo Go", "Metro empaqueta el código de la app mientras programas; Expo Go es la app del teléfono que "
     "lo descarga y lo muestra.", "Metro en <code>localhost:8081</code>; Expo Go dentro del emulador"],
    ["Clientes de prueba", "Swagger UI, <code>requests.http</code> y Postman prueban el backend sin la web. "
     "DataGrip mira la base.", "Navegador, IntelliJ, Postman y DataGrip"],
])}
{nota("<b>Cómo se conectan:</b> Tú, en el navegador → web en <code>localhost:5173</code> → backend en "
      "<code>localhost:8080</code> → PostgreSQL en <code>localhost:5432</code> ← DataGrip. La app móvil corre en "
      "el emulador y hoy usa <b>sólo datos de ejemplo</b>: todavía no le pide nada al backend.")}
""")


def preparacion() -> str:
    clonar_linux = cmd("mkdir -p ~/Desktop && cd ~/Desktop", "git clone https://github.com/HD4nielBu/StockFlow.git",
                       "cd StockFlow", "git switch Hector")
    clonar_mac = cmd("cd ~/Desktop", "git clone https://github.com/HD4nielBu/StockFlow.git", "cd StockFlow",
                     "git switch Hector")
    clonar_win = cmd(r"mkdir C:\dev", r"cd C:\dev", "git clone https://github.com/HD4nielBu/StockFlow.git",
                     "cd StockFlow", "git switch Hector")
    token = falla("Si <code>git clone</code> pide usuario y contraseña, GitHub ya no acepta la contraseña: usa un "
                  "token personal (GitHub → Settings → Developer settings → Personal access tokens) o una llave "
                  "SSH, o pide acceso al dueño del repositorio.")
    if SO == "linux":
        pasos = "".join([
            paso("prep1", "Preparación 1 · Instalar Git, Java 21 y JetBrains Toolbox",
                 "<p>Abre una terminal y ejecuta sólo la línea de tu distribución (pide tu contraseña):</p>"
                 + cmd("# Ubuntu / Debian", "sudo apt update && sudo apt install -y git curl openjdk-21-jdk",
                       "# Fedora", "sudo dnf install -y git curl java-21-openjdk-devel",
                       "# Arch / CachyOS", "sudo pacman -S --needed git curl jdk21-openjdk")
                 + "<p>Después instala JetBrains Toolbox: descárgalo de <b>jetbrains.com/toolbox-app</b> (archivo "
                   ".tar.gz), descomprímelo y ejecuta <code>jetbrains-toolbox</code>. Desde Toolbox se instalan "
                   "IntelliJ IDEA, WebStorm, DataGrip y Android Studio (con la licencia de estudiante).</p>",
                 ver("<code>git --version</code> y <code>java -version</code> responden; esta última con una línea "
                     "que empieza con <code>openjdk version \"21</code>."),
                 falla("Si <code>java -version</code> muestra otra versión (por ejemplo 17 o 25), no importa: en el "
                       "capítulo 3, paso 5, IntelliJ usa la 21 (o la descarga).")),
            paso("prep2", "Preparación 2 · Instalar Docker",
                 "<p>Hay dos formas. Elige una sola. La opción A es la más común en Linux.</p>"
                 "<p><b>Opción A · Docker Engine.</b> En Ubuntu, Debian o Fedora, el script oficial instala todo "
                 "(incluido <code>docker compose</code>):</p>" + cmd("curl -fsSL https://get.docker.com | sudo sh")
                 + "<p>En Arch/CachyOS: <code>sudo pacman -S docker docker-compose</code>. Luego deja Docker encendido "
                   "y permite usarlo sin sudo:</p>"
                 + cmd("sudo systemctl enable --now docker", "sudo usermod -aG docker $USER")
                 + "<p>Cierra la sesión y vuelve a entrar para que el permiso se aplique.</p>"
                   "<p><b>Opción B · Docker Desktop</b> (la aplicación con ventana; es la que usa el autor del "
                   "proyecto): descarga el paquete desde <b>docs.docker.com/desktop/setup/install/linux</b> y sigue "
                   "las instrucciones de tu distribución.</p>",
                 ver("Después de volver a entrar a la sesión, <code>docker run --rm hello-world</code> muestra "
                     "<code>Hello from Docker!</code> (sin sudo)."),
                 falla("<code>permission denied while trying to connect to the Docker daemon socket</code>: todavía "
                       "no cerraste y abriste la sesión después del <code>usermod</code>. Con Docker Desktop, "
                       "<code>Cannot connect to the Docker daemon</code> significa que no está abierto."),
                 entender("PostgreSQL no se instala en tu sistema: Docker lo ejecuta en un contenedor, siempre con la "
                          "misma versión (16) para todo el equipo. Las pruebas automáticas del backend también usan "
                          "Docker (Testcontainers).")),
            paso("prep3", "Preparación 3 · Comprobar que el comando docker funciona",
                 "<p>Con Docker encendido (Docker Desktop: <code>systemctl --user start docker-desktop</code>):</p>"
                 + cmd("docker ps", "docker compose version"),
                 ver("<code>docker ps</code> muestra una tabla con los títulos <code>CONTAINER ID IMAGE …</code> "
                     "(aunque esté vacía) y <code>docker compose version</code> muestra <code>Docker Compose version "
                     "v2…</code>."),
                 falla("<code>'compose' is not a docker command</code>: en Ubuntu/Debian <code>sudo apt install "
                       "docker-compose-plugin</code>; en Arch <code>sudo pacman -S docker-compose</code>. Con Docker "
                       "Desktop, <code>docker context show</code> debe decir <code>desktop-linux</code> (si no, "
                       "<code>docker context use desktop-linux</code>)."),
                 entender("Docker Desktop crea su propio contexto (<code>desktop-linux</code>); Docker Engine usa el "
                          "normal. Por eso, con Docker Desktop, <code>sudo systemctl start docker</code> responde "
                          "<code>Unit docker.service not found</code>.")),
            paso("prep4", "Preparación 4 · Comprobar que tienes Node.js y npm",
                 "<p>La web necesita Node.js 20.19 o superior (lo exige Vite 8); la app móvil, una versión LTS "
                 "actual. En la terminal:</p>" + cmd("node -v", "npm -v"),
                 ver("Dos versiones, por ejemplo <code>v22.x</code> y <code>10.x</code> o superiores. En la "
                     "computadora del autor: <code>v24.21.0</code> y <code>11.19.0</code>."),
                 falla("Si no está instalado o es menor a 20.19 (Ubuntu 24.04 y Debian 12 traen la 18), instálalo "
                       "con nvm: <code>curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | "
                       "bash</code>, cierra y abre la terminal y <code>nvm install --lts</code>. En Fedora y Arch: "
                       "<code>sudo dnf install nodejs</code> o <code>sudo pacman -S nodejs npm</code>."),
                 entender("Node.js es a JavaScript lo que Java es al backend. npm es el equivalente a Maven: lee "
                          "<code>package.json</code> y descarga las librerías.")),
            paso("prep5", "Preparación 5 · Descargar el proyecto (o actualizarlo)",
                 "<p>Si es la primera vez en esta computadora:</p>" + clonar_linux
                 + "<p>Si ya lo tenías: <code>cd ~/Desktop/StockFlow</code> y <code>git pull</code>.</p>",
                 ver("<code>git status -sb</code> muestra <code>## Hector...origin/Hector</code> sin la palabra "
                     "<code>behind</code>."),
                 token,
                 entender("Toda la guía usa <code>~/Desktop/StockFlow</code>. Si tu escritorio se llama Escritorio, "
                          "no importa: <code>mkdir -p ~/Desktop</code> crea la carpeta igual.")),
        ])
    elif SO == "macos":
        pasos = "".join([
            paso("prep1", "Preparación 1 · Instalar las herramientas (una sola vez)",
                 "<p>Abre la app Terminal (Cmd+Espacio → Terminal). La forma más simple es con Homebrew. La primera "
                 "línea lo instala (pide tu contraseña de macOS); las otras, los programas:</p>"
                 + cmd('/bin/bash -c "$(curl -fsSL \\', '  https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
                       "brew install git node", "brew install --cask docker-desktop jetbrains-toolbox postman")
                 + "<p><b>Importante:</b> al terminar, Homebrew muestra <i>Next steps</i> con uno o dos comandos "
                   "(<code>echo … &gt;&gt; ~/.zprofile</code> y <code>eval …</code>). Ejecútalos: si no, la terminal "
                   "no encuentra <code>brew</code>. Java no hace falta: IntelliJ lo descarga en el capítulo 3, paso 5. "
                   "Android Studio se instala en el capítulo 5.</p>",
                 ver("Cada <code>brew install</code> termina sin <code>Error:</code>. Docker, JetBrains Toolbox y "
                     "Postman aparecen en Aplicaciones."),
                 falla("Si <code>brew install --cask docker-desktop</code> no encuentra el programa, descarga Docker "
                       "Desktop de docker.com/products/docker-desktop eligiendo <i>Mac with Apple chip</i> o "
                       "<i>Intel chip</i> (menú Apple → Acerca de esta Mac).")),
            paso("prep2", "Preparación 2 · Comprobar que todo quedó instalado",
                 "<p>En una Terminal nueva:</p>" + cmd("git --version", "docker --version", "node -v", "npm -v"),
                 ver("Cuatro versiones, por ejemplo <code>git version 2.5x</code>, <code>Docker version 28.x</code>, "
                     "<code>v22.x</code> y <code>10.x</code> o superiores. Node.js debe ser 20.19 o superior."),
                 falla("Si alguno dice <code>command not found</code>, cierra y abre la terminal; si sigue igual, "
                       "repite su instalación.")),
            paso("prep3", "Preparación 3 · Descargar el proyecto (o actualizarlo)",
                 "<p>Si es la primera vez en esta computadora:</p>" + clonar_mac
                 + "<p>Si ya lo tenías: <code>cd ~/Desktop/StockFlow</code> y <code>git pull</code>.</p>",
                 ver("<code>git status -sb</code> muestra <code>## Hector...origin/Hector</code> sin "
                     "<code>behind</code>."),
                 token,
                 entender("Si Escritorio y Documentos están en iCloud, iCloud puede sincronizar "
                          "<code>node_modules</code> y <code>target</code>. Si notas lentitud, clona en "
                          "<code>~/dev/StockFlow</code> y usa esa ruta en el resto de la guía.")),
        ])
    else:
        pasos = "".join([
            paso("prep1", "Preparación 1 · Instalar las herramientas (una sola vez)",
                 "<p>Abre PowerShell (menú Inicio → PowerShell) y ejecuta uno por uno. <code>winget</code> viene con "
                 "Windows 10 y 11:</p>"
                 + cmd("winget install --id Git.Git -e", "winget install --id Docker.DockerDesktop -e",
                       "winget install --id JetBrains.Toolbox -e", "winget install --id OpenJS.NodeJS.LTS -e",
                       "winget install --id Postman.Postman -e")
                 + "<p>Java no hace falta: IntelliJ lo descarga en el capítulo 3, paso 5. Android Studio se instala "
                   "en el capítulo 5. <b>Cierra PowerShell y vuelve a abrirlo</b> al terminar.</p>",
                 ver("Cada comando termina con <code>Successfully installed</code> (o <i>Se instaló "
                     "correctamente</i>)."),
                 falla("Si <code>winget</code> no se reconoce, instala <i>App Installer</i> desde Microsoft Store, o "
                       "descarga cada programa de su página (git-scm.com, docker.com, jetbrains.com/toolbox-app, "
                       "nodejs.org, postman.com)."),
                 entender("Docker Desktop necesita Windows 10 (22H2) u 11 de 64 bits. Es gratuito para uso "
                          "educativo.")),
            paso("prep2", "Preparación 2 · Activar WSL 2 (lo necesita Docker Desktop)",
                 "<p>Abre PowerShell <b>como administrador</b> (clic derecho → Ejecutar como administrador):</p>"
                 + cmd("wsl --install") + "<p>Reinicia la computadora. Después, en un PowerShell normal:</p>"
                 + cmd("wsl --status"),
                 ver("<code>Versión predeterminada: 2</code> (o <code>Default Version: 2</code>)."),
                 falla("Un error de virtualización (<code>0x80370102</code> o <i>Please enable the Virtual Machine "
                       "Platform</i>) se resuelve activando Intel VT-x o AMD SVM en la BIOS/UEFI. La misma "
                       "virtualización la usa después el emulador de Android."),
                 entender("La imagen <code>postgres:16</code> es un programa de Linux: Docker Desktop la ejecuta "
                          "dentro de WSL 2.")),
            paso("prep3", "Preparación 3 · Comprobar que todo quedó instalado",
                 "<p>En un PowerShell nuevo:</p>" + cmd("git --version", "docker --version", "node -v", "npm -v"),
                 ver("Cuatro versiones, por ejemplo <code>git version 2.5x</code>, <code>Docker version 28.x</code>, "
                     "<code>v22.x</code> y <code>10.x</code> o superiores. Node.js debe ser 20.19 o superior."),
                 falla("Si <code>npm -v</code> responde <i>No se puede cargar el archivo …\\npm.ps1 porque la "
                       "ejecución de scripts está deshabilitada</i>, ejecuta una sola vez "
                       "<code>Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</code> y responde S.")),
            paso("prep4", "Preparación 4 · Descargar el proyecto (o actualizarlo)",
                 "<p>Si es la primera vez en esta computadora:</p>" + clonar_win
                 + r"<p>Si ya lo tenías: <code>cd C:\dev\StockFlow</code> y <code>git pull</code>.</p>",
                 ver("<code>git status -sb</code> muestra <code>## Hector...origin/Hector</code> sin "
                     "<code>behind</code>."),
                 token,
                 entender(r"Se usa <code>C:\dev\StockFlow</code> y no el Escritorio porque en muchas computadoras el "
                          "Escritorio está en OneDrive, que intenta sincronizar <code>node_modules</code> y "
                          "<code>target</code> y provoca errores raros.")),
        ])
    return capitulo("prep", "2. Preparación (se hace una sola vez)", pasos)


def backend() -> str:
    if SO == "linux":
        encender = paso("b1", "Paso 1 · Encender Docker",
                        "<p>Según lo que instalaste en la preparación 2, ejecuta una de estas dos líneas:</p>"
                        + cmd("sudo systemctl start docker              # Docker Engine (opción A)",
                              "systemctl --user start docker-desktop    # Docker Desktop (opción B)"),
                        ver("No muestra nada (eso es bueno). Comprueba con <code>docker ps</code>: si muestra una "
                            "tabla, Docker está listo. Docker Desktop puede tardar 20-60 segundos."),
                        falla("<code>Cannot connect to the Docker daemon</code>: espera unos segundos y repite. "
                              "<code>permission denied</code>: revisa la preparación 2 (grupo docker)."),
                        entender("Si hiciste <code>sudo systemctl enable --now docker</code>, Docker Engine arranca "
                                 "solo al encender la computadora."))
    else:
        app = s("", "Aplicaciones (o Cmd+Espacio → Docker)", "el menú Inicio")
        encender = paso("b1", "Paso 1 · Encender Docker Desktop",
                        f"<p>Abre Docker Desktop desde {app}. La primera vez acepta las condiciones y elige "
                        "<i>Use recommended settings</i>; puedes omitir el inicio de sesión (Skip). Cuando diga "
                        f"<b>Engine running</b>, en {TERMINAL}:</p>" + cmd("docker ps"),
                        ver("Una tabla con los títulos <code>CONTAINER ID IMAGE …</code> (aunque esté vacía)."),
                        falla(s("", "<code>Cannot connect to the Docker daemon at unix:///Users/…/docker.sock</code>",
                                "<code>error during connect … The system cannot find the file specified</code>")
                              + ": Docker Desktop está cerrado o todavía arrancando. Ábrelo y espera."),
                        entender("Docker Desktop es una aplicación normal: no se enciende con comandos. Para no "
                                 "abrirlo cada vez: Settings → General → <i>Start Docker Desktop when you sign "
                                 "in</i>."))
    puerto_ocupado = s("ya hay otro PostgreSQL en tu computadora: detenlo con <code>sudo systemctl stop "
                       "postgresql</code> y repite",
                       "ya tienes otro PostgreSQL (Homebrew o Postgres.app): mira el capítulo 8",
                       "ya hay un PostgreSQL instalado en Windows: mira el capítulo 8")
    abrir_idea = s(
        "<p><b>Forma A</b>, desde la terminal:</p>"
        + cmd("~/.local/share/JetBrains/Toolbox/scripts/idea \\", "    ~/Desktop/StockFlow/intellij/stockflow-backend")
        + "<p><b>Forma B</b>, con el mouse: JetBrains Toolbox → IntelliJ IDEA → <b>Open</b> → Desktop → StockFlow → "
          "intellij → stockflow-backend → OK.</p>",
        "<p>JetBrains Toolbox → IntelliJ IDEA → <b>Open</b> (o, si ya está abierto, File → Open…) → "
        "<code>~/Desktop/StockFlow/intellij/stockflow-backend</code> → Open.</p>",
        r"<p>JetBrains Toolbox → IntelliJ IDEA → <b>Open</b> (o, si ya está abierto, File → Open…) → "
        r"<code>C:\dev\StockFlow\intellij\stockflow-backend</code> → OK.</p>")
    jdk = s("<code>/usr/lib/jvm/java-21-openjdk-amd64</code> (Ubuntu/Debian) o <code>/usr/lib/jvm/java-21-openjdk"
            "</code> (Fedora y Arch). O más fácil: ", "", "")
    firewall = s("", " Si macOS pregunta si <i>java</i> puede aceptar conexiones entrantes, puedes elegir Denegar: "
                     "para usar StockFlow en esta Mac no hace falta.",
                 " Si aparece el Firewall de Windows Defender sobre <i>OpenJDK Platform binary</i>, puedes pulsar "
                 "Cancelar: para usar StockFlow en esta computadora no hace falta permitirlo.")
    return capitulo("backend", "3. Poner en marcha la base y el backend", """
<p>Sigue los pasos en orden. Del 1 al 7 dejan la base y el backend funcionando; del 8 al 12 sirven para probar la API
y para mostrar el proyecto en la defensa.</p>""") + "".join([
        encender,
        paso("b2", "Paso 2 · Levantar la base de datos",
             "<p>Desde la carpeta del proyecto:</p>" + cmd(f"cd {ruta()}", "docker compose up -d")
             + "<p>Datos de conexión (los usa el backend; tú los necesitas para DataGrip):</p>"
             + tabla(["Dato", "Valor"], [["Host", "localhost"], ["Puerto", "5432"],
                                         ["Base de datos", "stockflow (tablas en el esquema stockflow)"],
                                         ["Usuario", "stockflow_admin"], ["Contraseña", "Cambia_Esta_Clave_2026!"]]),
             ver("La primera vez descarga la imagen <code>postgres:16</code> y termina con <code>Container "
                 "stockflow-postgres Started</code>. Las siguientes veces responde enseguida."),
             falla("<code>no configuration file provided</code>: no estás en la carpeta del proyecto (revisa el "
                   f"<code>cd</code>). <code>port is already allocated</code> en el 5432: {puerto_ocupado}."),
             entender("<code>docker compose</code> lee <code>docker-compose.yml</code> y crea un contenedor con "
                      "PostgreSQL 16, la base <code>stockflow</code> y el usuario <code>stockflow_admin</code>. "
                      "<code>-d</code> lo deja en segundo plano. La contraseña es sólo de laboratorio: para usar otra, "
                      "crea un <code>.env</code> (git lo ignora) con <code>DB_PASSWORD=tu_clave</code> antes del "
                      "primer <code>up</code> y pon la misma variable en IntelliJ.")),
        paso("b3", "Paso 3 · Comprobar que la base está lista",
             "<p>Espera unos 10 segundos y ejecuta:</p>" + cmd("docker ps"),
             ver("Una fila <code>stockflow-postgres</code> con <code>Up … (healthy)</code> y el puerto "
                 "<code>0.0.0.0:5432-&gt;5432/tcp</code>."),
             falla("<code>(health: starting)</code>: espera y repite. Si no aparece la fila, repite el paso 2."),
             entender("<i>healthy</i> significa que PostgreSQL ya acepta conexiones (lo comprueba el healthcheck del "
                      "<code>docker-compose.yml</code>).")),
        paso("b4", "Paso 4 · Abrir el backend en IntelliJ IDEA",
             "<p><b>Muy importante:</b> hay que abrir la carpeta <code>intellij/stockflow-backend</code> (la que tiene "
             "<code>pom.xml</code>), no la carpeta StockFlow. Si abres otra, IntelliJ no reconoce el proyecto.</p>"
             + abrir_idea + "<p>Si pregunta <i>Trust and Open Project?</i>, elige <b>Trust Project</b>.</p>",
             ver("El panel Project muestra <code>stockflow-backend</code> con <code>src</code> y <code>pom.xml</code>. "
                 "Espera a que termine la barra de progreso (<i>Importing Maven project</i>, <i>Indexing…</i>)."),
             falla("Si el panel muestra StockFlow con <code>docs</code> y <code>datagrip</code>, abriste la carpeta "
                   "equivocada: File → Close Project y repite.")),
        paso("b5", "Paso 5 · Elegir Java 21 en IntelliJ (sólo la primera vez)",
             lista(f"Menú File → Project Structure… ({ATAJO_ESTRUCTURA}).", "A la izquierda elige <b>Project</b>.",
                   "En <b>SDK</b> debe aparecer 21. Si ya está, OK y sigue al paso 6.",
                   f"Si no: SDK → Add SDK → JDK… y elige {jdk}SDK → <b>Download JDK…</b> → Version 21 → Vendor "
                   "Eclipse Temurin → Download.", "Pulsa OK."),
             ver("Desaparece el aviso amarillo <i>Project JDK is not defined</i>."),
             falla("<code>invalid source release: 21</code> o <code>Unsupported class file major version</code>: el "
                   "SDK no es el 21; repite este paso.")),
        paso("b6", "Paso 6 · Ejecutar StockFlowApplication",
             lista(f"Pulsa {ATAJO_CLASE}, escribe <code>StockFlowApplication</code> y Enter.",
                   "A la izquierda de <code>public class StockFlowApplication</code> hay un triángulo verde ▶.",
                   "Clic en el triángulo → <b>Run 'StockFlowApplication'</b>.",
                   "Abajo se abre la ventana Run con el registro (log) del arranque.")
             + f"<p>Desde la segunda vez: el ▶ verde de la barra superior o {ATAJO_RUN}.</p>",
             ver("Las líneas importantes, copiadas de un arranque real del proyecto:"
                 "<ul class='checks'><li><code>Tomcat initialized with port 8080 (http)</code> → el servidor web se "
                 "preparó en el puerto 8080.</li><li><code>HikariPool-1 - Start completed.</code> → se conectó a "
                 "PostgreSQL.</li><li><code>Database: jdbc:postgresql://localhost:5432/stockflow (PostgreSQL 16.15)"
                 "</code> → Flyway encontró la base.</li><li><code>Schema \"stockflow\" is up to date. No migration "
                 "necessary.</code> → las tablas ya existen. Con una base nueva verías <code>Migrating schema "
                 "\"stockflow\" to version \"1 …\"</code>, luego 2 y 3.</li><li><code>Started StockFlowApplication in "
                 "3.186 seconds</code> → ¡listo!</li></ul>"),
             falla("<code>APPLICATION FAILED TO START</code> o una excepción en rojo: busca el mensaje en el capítulo "
                   "8." + firewall),
             entender("No cierres esa ventana ni pulses el cuadrado rojo ■ mientras pruebas: el backend vive mientras "
                      "esa ejecución esté activa.")),
        paso("b7", "Paso 7 · Comprobar en el navegador que el backend responde",
             cmd("http://localhost:8080/api/health"),
             ver("Un JSON como <code>{\"status\":\"OK\", \"stage\":\"HEXAGONAL_RELACION_1N\", \"project\":\"StockFlow - "
                 "Inventario y Movimientos de Almacén (PA-06)\", \"application\":\"stockflow-backend\", …}</code>. "
                 "Después prueba <code>http://localhost:8080/api/categorias</code> (las 4 categorías de la semilla) "
                 "y <code>http://localhost:8080/api/productos</code> (los 5 productos)."),
             falla("<i>No se puede conectar</i> o <i>Connection refused</i>: el backend no está corriendo; vuelve al "
                   "paso 6.")),
        paso("b8", "Paso 8 · Probar la API con Swagger UI",
             cmd("http://localhost:8080/swagger-ui.html")
             + lista("Verás los grupos categoria-controller, producto-controller, ubicacion-controller e "
                     "inventario-controller.",
                     "Abre <code>GET /api/productos/{id}</code> → <b>Try it out</b> → id = 1 → <b>Execute</b>: "
                     "<code>200</code> y el JSON de <i>Resma papel bond A4 75g</i>.",
                     "Prueba un error: id = 9999 → <code>404</code> con <i>No existe el producto con id: 9999</i>."),
             ver("Cada respuesta con su código HTTP (200, 201, 404…) y el JSON."),
             falla("Si la página no carga, revisa que el backend siga corriendo (paso 6).")),
        paso("b9", "Paso 9 · Probar todos los casos con requests.http",
             lista(f"En IntelliJ pulsa {ATAJO_ARCHIVO}, escribe <code>requests.http</code> y Enter.",
                   "Cada petición tiene un ▶ verde a su izquierda: la respuesta aparece abajo.",
                   "Ejecútalas <b>en orden</b>: los primeros POST guardan el id creado en "
                   "<code>{{categoriaId}}</code> y <code>{{productoId}}</code>, que usan los PUT y DELETE.",
                   "El título de cada petición dice el código esperado, por ejemplo <code>### [409] Código UNIQUE "
                   "repetido</code>.")
             + "<p>Si IntelliJ pregunta por un <i>environment</i>, elige <b>No Environment</b>.</p>",
             ver("Cada respuesta con el código que indica su título: 201, 200, 400, 404, 409, 422 o 204."),
             falla("Si un PUT o DELETE con <code>{{productoId}}</code> falla, ejecuta primero el POST que lo crea. Si "
                   "ejecutas todo dos veces, algunos POST darán 409 porque el código ya existe: es correcto.")),
        paso("b10", "Paso 10 · Ver el SQL que ejecuta Hibernate",
             "<p>Mientras pruebas, mira la ventana Run del paso 6: con cada petición aparecen las sentencias SQL, por "
             "ejemplo <code>select cje1_0.categoria_id, …</code>. Un POST muestra <code>insert into stockflow.producto"
             " …</code>, un PUT <code>update …</code> y un DELETE <code>delete from …</code>.</p>",
             ver("SQL con formato legible después de cada petición."),
             entender("Está activado en <code>application.yml</code> (<code>org.hibernate.SQL: debug</code> y "
                      "<code>format_sql: true</code>). Es la evidencia de que un POST llegó a PostgreSQL.")),
        paso("b11", "Paso 11 · Ver los datos en DataGrip",
             lista("Abre DataGrip (desde Toolbox).", "<b>+</b> → Data Source → PostgreSQL.",
                   "Host localhost · Port 5432 · Database stockflow · User stockflow_admin · Password "
                   "Cambia_Esta_Clave_2026!",
                   "Si aparece <i>Download missing driver files</i>, descárgalos.",
                   "<b>Test Connection</b> → <i>Succeeded</i> → OK.",
                   "Despliega stockflow → stockflow → tables: 18 tablas (17 del proyecto + "
                   "<code>flyway_schema_history</code>).",
                   f"File → Open → <code>{ruta('datagrip', '03_verificacion_y_pruebas.sql')}</code>; cursor en una "
                   f"consulta y {CTRL}+Enter."),
             ver("Los resultados en una tabla debajo del editor."),
             falla("La sección 7 del script tiene pruebas que <b>deben</b> fallar (muestran que las constraints "
                   "funcionan). La sección 8 modifica datos y es segura de repetir.")),
        paso("b12", "Paso 12 · Ejecutar las pruebas automáticas",
             lista("En el panel Project, clic derecho sobre <code>src/test/java</code>.", "<b>Run 'All Tests'</b>."),
             ver("Barra verde y <code>Tests passed: 60</code> (comprobado el " + FECHA + "). La primera vez tarda más "
                 "porque descarga PostgreSQL para las pruebas de integración."),
             falla("Si Docker está apagado, las 11 pruebas de <code>PersistenciaPostgresTest</code> aparecen omitidas; "
                   "no es un error. Enciende Docker y repite."),
             entender("Las pruebas no tocan tu base: <code>PersistenciaPostgresTest</code> crea un PostgreSQL temporal "
                      "(Testcontainers) y lo borra al terminar.")),
    ])


def frontend() -> str:
    abrir_ws = s(
        "<p><b>Forma A</b>, desde la terminal:</p>"
        + cmd("~/.local/share/JetBrains/Toolbox/scripts/webstorm \\", "    ~/Desktop/StockFlow/webstorm/stockflow-frontend")
        + "<p><b>Forma B</b>: Toolbox → WebStorm → <b>Open</b> → Desktop → StockFlow → webstorm → stockflow-frontend → "
          "OK → Trust Project.</p>",
        "<p>Toolbox → WebStorm → <b>Open</b> → <code>~/Desktop/StockFlow/webstorm/stockflow-frontend</code> → Open → "
        "Trust Project.</p>",
        r"<p>Toolbox → WebStorm → <b>Open</b> → <code>C:\dev\StockFlow\webstorm\stockflow-frontend</code> → OK → "
        r"Trust Project.</p>")
    return capitulo("web", "4. Poner en marcha la aplicación web (React)", """
<p>La web vive en <code>webstorm/stockflow-frontend</code> y se trabaja con WebStorm. Necesita la base y el backend
del capítulo 3 encendidos: si no, abre, pero no muestra datos.</p>""" + nota(
        "Vas a tener dos programas corriendo a la vez: el backend en IntelliJ (8080) y la web en la terminal de "
        "WebStorm (5173). El navegador abre el 5173 y la web le pide los datos al 8080.")) + "".join([
        paso("f1", "Web 1 · Abrir el frontend en WebStorm",
             "<p>Antes: el backend tiene que estar corriendo (capítulo 3, paso 6). Hay que abrir la carpeta exacta "
             "<code>webstorm/stockflow-frontend</code>, la que tiene <code>package.json</code>.</p>" + abrir_ws,
             ver("En el panel Project: <code>stockflow-frontend</code> con <code>src</code>, <code>public</code>, "
                 "<code>package.json</code>, <code>vite.config.ts</code>, <code>nginx.conf</code> y "
                 "<code>.env.development</code>."),
             falla("Si ves StockFlow con <code>docs</code> e <code>intellij</code>, abriste la carpeta equivocada.")),
        paso("f2", "Web 2 · Instalar las dependencias (la primera vez)",
             f"<p>Terminal de WebStorm: View → Tool Windows → Terminal ({ATAJO_TERMINAL}). Ya se abre en la carpeta "
             "del frontend:</p>" + cmd("npm install"),
             ver("Termina con <code>added … packages</code> y aparece la carpeta <code>node_modules</code>."),
             falla("Si WebStorm muestra el aviso <i>Run 'npm install'</i>, ese botón hace lo mismo. Si aparece "
                   "<code>ERR!</code> por la red, revisa tu conexión y repite."
                   + s("", "", " Si aparece <i>No se puede cargar el archivo …\\npm.ps1</i>, ejecuta una vez "
                               "<code>Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</code>.")),
             entender("<code>node_modules</code> no se sube a git; cada integrante lo genera. "
                      "<code>package-lock.json</code> sí está en git y fija las mismas versiones para todos. Repite "
                      "<code>npm install</code> cuando un <code>git pull</code> cambie <code>package.json</code>.")),
        paso("f3", "Web 3 · Revisar la dirección del backend (.env.development)",
             "<p>Abre <code>.env.development</code> (raíz de stockflow-frontend). Debe contener:</p>"
             + cmd("VITE_API_URL=http://localhost:8080/api"),
             ver("Esa línea (más dos comentarios). No hace falta cambiar nada."),
             falla("Si el archivo no existe, créalo copiando <code>.env.example</code>."),
             entender("La web lee la dirección del backend de esta variable (<code>src/config/env.ts</code>). En "
                      "producción, <code>.env.production</code> usa <code>/api</code> y <code>nginx.conf</code> la "
                      "reenvía al backend. Sólo las variables <code>VITE_</code> llegan al navegador: nunca pongas "
                      "contraseñas aquí.")),
        paso("f4", "Web 4 · Encender la web",
             "<p>En la terminal de WebStorm:</p>" + cmd("npm run dev"),
             ver("Copiado de un arranque real:<ul class='checks'><li><code>VITE v8.3.2 ready in 149 ms</code> → el "
                 "servidor de desarrollo arrancó.</li><li><code>➜ Local: http://localhost:5173/</code> → la dirección "
                 "de la aplicación.</li></ul>"),
             falla(f"<code>Port 5173 is already in use</code>: ya hay otro <code>npm run dev</code>; ciérralo con "
                   f"Ctrl+C o búscalo con <code>{puerto(5173)}</code>. El proyecto no se cambia de puerto a "
                   "propósito: el backend sólo acepta el 5173 (CORS)."),
             entender("No cierres esa terminal mientras uses la aplicación. Al guardar un archivo, la página se "
                      "actualiza sola.")),
        paso("f5", "Web 5 · Entrar en modo demostración",
             "<p>Abre en el navegador:</p>" + cmd("http://localhost:5173/login")
             + lista("Verás <b>Entrar a StockFlow</b> con un aviso amarillo: <i>Modo demostración. StockFlow aún no "
                     "tiene inicio de sesión real</i>.",
                     "Escribe cualquier correo o usuario (por ejemplo <code>maria.lopez@uni.edu</code>) y cualquier "
                     "contraseña. Marca <i>Recordarme</i> si quieres que el navegador recuerde tu nombre.",
                     "Pulsa <b>Entrar en modo demo</b>: comprueba que el backend responde (<code>GET "
                     "/api/health</code>) y te lleva al Inicio."),
             ver("El <b>Inicio</b>, con el menú azul a la izquierda (Principal, Inventario, Administración):"
                 "<ul class='checks'><li>Un saludo con la fecha y cuatro accesos rápidos: Nuevo producto, Nueva "
                 "categoría, Existencias y Dashboard.</li><li>Indicadores con la semilla: <b>Productos 5</b>, "
                 "<b>Categorías 4</b>, <b>Bajo el stock mínimo 1</b> y <b>Ubicaciones con stock 2</b>.</li>"
                 "<li>En <i>Alertas de inventario</i>: Bolígrafo azul, Depósito Norte, <b>25 / 100</b>.</li>"
                 "<li>Abajo a la izquierda, tu nombre y tus iniciales (<i>Invitado</i> si entraste directo a "
                 "<code>http://localhost:5173</code>).</li></ul>"),
             falla("Si al entrar aparece <i>El servidor no responde</i>, el backend está apagado: enciéndelo (capítulo "
                   "3, paso 6). El botón <i>Entrar sin conexión</i> deja pasar igual, pero las pantallas mostrarán "
                   "<i>No se pudo conectar con el backend</i>."),
             entender("El backend todavía no tiene usuarios ni contraseñas: este login <b>no es seguridad</b>. No "
                      "verifica credenciales ni envía la contraseña; sólo guarda el nombre a mostrar en el navegador. "
                      "Por eso también se puede abrir <code>http://localhost:5173</code> sin entrar.")),
        paso("f6", "Web 6 · Recorrer las pantallas del menú",
             "<p>Cada opción del menú es una ruta. Las marcadas <b>Demo</b> en el menú usan datos locales y lo dicen "
             "en pantalla; el resto viene del backend:</p>"
             + tabla(["Menú", "Qué muestra", "Datos"], [
                 ["Inicio · Dashboard", "Indicadores, alertas, gráficos y últimos productos", "Reales"],
                 ["Categorías · Productos", "CRUD con búsqueda, filtros y paginación (Web 7)", "Reales"],
                 ["Existencias", "Stock por producto y ubicación, y cobertura del mínimo", "Reales"],
                 ["Movimientos", "Kardex de un producto, paginado en el servidor", "Reales"],
                 ["Almacenes", "Ubicaciones con su stock y alta de ubicaciones", "Reales"],
                 ["Reportes", "Exportaciones CSV generadas en el navegador", "Reales"],
                 ["Usuarios · Configuración · Perfil", "Roles, tema y datos de la sesión", "Demo (o mixtos)"],
             ]) + f"<p>Atajo útil: el buscador de arriba (<b>{CTRL}+K</b>) salta a cualquier sección; el sol/luna "
                  "cambia entre tema claro y oscuro.</p>",
             ver("Cada pantalla carga sin recuadros rojos. Recargar con F5 en cualquier ruta (por ejemplo "
                 "<code>/productos</code>) vuelve a la misma pantalla."),
             falla("Un recuadro <i>No se pudieron cargar…</i> con <b>Reintentar</b> indica que el backend se detuvo: "
                   "mira la ventana Run de IntelliJ.")),
        paso("f7", "Web 7 · Probar el CRUD desde las pantallas",
             "<p>Este recorrido demuestra que web, backend y base trabajan juntos (sirve para la defensa):</p>"
             + lista("<b>Categorías → Nueva categoría</b>: se abre una ventana. Pulsa <b>Crear categoría</b> con todo "
                     "vacío → <i>El código es obligatorio</i> y <i>El nombre es obligatorio</i> debajo de los campos. "
                     "Es la validación de la web: no se envió nada.",
                     "Escribe código <code>CAT-DEMO</code> y nombre <code>Demostración</code> → <b>Crear "
                     "categoría</b> → aviso verde <i>Categoría CAT-DEMO creada</i> y la fila aparece.",
                     "Repite el mismo código → dentro de la ventana, recuadro rojo <i>No se pudo guardar la "
                     "categoría</i> con el texto del backend: <i>Ya existe una categoría con el valor: CAT-DEMO</i> "
                     "(409).",
                     "En la fila <i>Material de oficina</i> abre el menú <b>⋯</b> → <b>Eliminar</b>: la confirmación "
                     "ya avisa que tiene 2 productos. Si confirmas, el backend responde 409 (<i>…tiene productos "
                     "asociados y no se puede eliminar; desactívala…</i>) y la fila se queda.",
                     "<b>Productos → Nuevo producto</b>: categoría Demostración, código <code>PRD-DEMO-001</code>, "
                     "nombre <code>Producto demo</code>, stock mínimo 5 → crear. Con el menú <b>⋯</b> usa "
                     "<b>Editar</b> para cambiarle el nombre y <b>Eliminar</b> para borrarlo.",
                     "Vuelve a Categorías y elimina CAT-DEMO (ya sin productos): desaparece."),
             ver("Con cada acción, la ventana Run de IntelliJ muestra el <code>insert</code>, <code>update</code> o "
                 "<code>delete</code> que llegó a PostgreSQL."),
             falla(f"Si algo no responde, abre la consola del navegador ({CONSOLA}) y busca el mensaje en rojo en el "
                   "capítulo 8."),
             entender("La web sólo muestra el resultado: las reglas (código único, no borrar una categoría con "
                      "productos) las decide el backend. Por eso, ante un 409, la fila no se quita.")),
        paso("f8", "Web 8 · Ejecutar las pruebas, el lint y el build",
             "<p>Abre otra pestaña de la terminal (botón +) para no detener <code>npm run dev</code>:</p>"
             + cmd("npm run test:run", "npm run lint", "npm run build"),
             ver("Comprobado el " + FECHA + ":<ul class='checks'><li><code>npm run test:run</code> → "
                 "<code>Test Files 30 passed (30)</code> y <code>Tests 107 passed (107)</code>.</li>"
                 "<li><code>npm run lint</code> → sin advertencias.</li><li><code>npm run build</code> → "
                 "<code>✓ built in …ms</code> y la carpeta <code>dist/</code>.</li></ul>"),
             falla("<code>error TS…</code> en el build es un error de tipos: el mensaje indica archivo y línea. Las "
                   "pruebas no necesitan el backend: usan datos simulados."),
             entender("Las pruebas están junto al código (<code>*.test.ts</code>, <code>*.test.tsx</code>) y usan "
                      "Vitest y Testing Library.")),
    ])


def movil() -> str:
    instalar_as = s(
        "<p>Abre JetBrains Toolbox e instala <b>Android Studio</b> (está en la lista junto a IntelliJ).</p>",
        "<p>Desde JetBrains Toolbox (botón Install junto a <b>Android Studio</b>) o con "
        "<code>brew install --cask android-studio</code>.</p>",
        "<p>Desde JetBrains Toolbox (botón Install junto a <b>Android Studio</b>) o con "
        "<code>winget install --id Google.AndroidStudio -e</code>.</p>")
    variables = s(
        cmd("# Agrega estas líneas al final de ~/.zshrc (o ~/.bashrc si usas bash)",
            "# Android SDK (guía móvil 01 · pasos 13-14)",
            'export ANDROID_HOME="$HOME/Android/Sdk"',
            'export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"')
        + "<p>Después abre una terminal nueva (o <code>source ~/.zshrc</code>).</p>",
        cmd("# Agrega estas líneas al final de ~/.zprofile",
            'export ANDROID_HOME="$HOME/Library/Android/sdk"',
            'export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"')
        + "<p>Después abre una Terminal nueva (o <code>source ~/.zprofile</code>).</p>",
        cmd('[Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\\Android\\Sdk", "User")',
            '$p = [Environment]::GetEnvironmentVariable("Path", "User")',
            '$sdk = "$env:LOCALAPPDATA\\Android\\Sdk"',
            '[Environment]::SetEnvironmentVariable("Path", "$p;$sdk\\platform-tools;$sdk\\emulator", "User")')
        + "<p>Cierra PowerShell y ábrelo de nuevo. También se puede hacer con el mouse: menú Inicio → <i>Editar las "
          "variables de entorno de esta cuenta</i>.</p>")
    acelerar = s(
        "El emulador usa la virtualización del procesador (KVM en Linux). <code>emulator -accel-check</code> debe decir "
        "<code>KVM … is installed and usable</code>; si no, activa VT-x/AMD-V en la BIOS y revisa que tu usuario "
        "pueda usar <code>/dev/kvm</code> (grupo <code>kvm</code>).",
        "En una Mac con chip Apple elige una imagen <b>arm64-v8a</b>; en una Mac Intel, <b>x86_64</b>. macOS no "
        "necesita configurar nada más para acelerar el emulador.",
        "El emulador usa la <i>Plataforma del hipervisor de Windows</i> (WHPX). Si <code>emulator -accel-check</code> "
        "no la detecta: menú Inicio → <i>Activar o desactivar las características de Windows</i> → marca <i>Plataforma "
        "del hipervisor de Windows</i> y reinicia. Convive con WSL 2 y Docker Desktop.")
    imagen = s("x86_64 con <i>Google Play</i>", "arm64-v8a (chip Apple) o x86_64 (Intel), con <i>Google Play</i>",
               "x86_64 con <i>Google Play</i>")
    expo_red = s('NODE_OPTIONS="--network-family-autoselection-attempt-timeout=3000" npx expo start --android',
                 windows='$env:NODE_OPTIONS = "--network-family-autoselection-attempt-timeout=3000"; '
                         'npx expo start --android')
    return capitulo("movil", "5. Poner en marcha la app móvil (React Native + Expo)", """
<p>La app vive en <code>androidstudio/stockflow-mobile</code>. Se escribe en TypeScript y corre en un teléfono Android
virtual (emulador). Este capítulo cubre lo implementado hasta la guía móvil 03: pantallas de categorías y productos
con navegación.</p>""" + nota(
        "<b>Importante:</b> hoy la app muestra <b>datos de ejemplo</b> guardados en "
        "<code>src/data/demoData.ts</code> (basados en la semilla de la base, más una categoría inactiva y otra sin "
        "productos). <b>No necesita el backend ni la base</b> y lo que veas no está en PostgreSQL. La conexión llega en "
        "la guía móvil 08 (<code>http://10.0.2.2:8080/api</code>) y el CRUD real en la 09.")) + "".join([
        paso("m1", "Móvil 1 · Instalar Android Studio y el Android SDK (una sola vez)",
             instalar_as + lista(
                 "Ábrelo. En el asistente de primer inicio elige <b>Standard</b> y acepta las licencias: descarga el "
                 "SDK.",
                 "Pantalla de bienvenida → <b>More Actions → SDK Manager</b>. Anota la <b>Android SDK Location</b> "
                 f"(normalmente <code>{SDK}</code>).",
                 "Pestaña <b>SDK Platforms</b>: deja marcada la versión que instaló el asistente y marca también "
                 "<b>Android 16 (API 36)</b>, que se usará para compilar en la guía 15.",
                 "Pestaña <b>SDK Tools</b>: comprueba <b>Android SDK Platform-Tools</b>, <b>Android Emulator</b> y "
                 "<b>Android SDK Build-Tools</b>. <b>Apply → OK</b>."),
             ver("El SDK Manager muestra las piezas como <i>Installed</i> y la carpeta del SDK contiene "
                 "<code>platform-tools</code>, <code>emulator</code>, <code>platforms</code> y "
                 "<code>build-tools</code>."),
             falla("<i>Unable to access Android SDK add-on list</i> en el primer arranque: pulsa <b>Cancel</b> (no "
                   "<i>Setup Proxy</i>) y sigue el asistente; ese aviso sólo trata de componentes opcionales. Si "
                   "después no descarga nada: Settings → HTTP Proxy → <i>No proxy</i> → <i>Check connection</i> con "
                   "<code>https://dl.google.com</code>."),
             entender("No se usa <i>New Project</i> de Android Studio: el proyecto ya existe y lo maneja Expo. Android "
                      "Studio aporta el SDK, <code>adb</code> y el emulador.")),
        paso("m2", "Móvil 2 · Configurar ANDROID_HOME y adb (una sola vez)", variables
             + "<p>Comprueba en una terminal nueva:</p>" + cmd("adb version", "emulator -version"),
             ver("<code>Android Debug Bridge version 1.0.41</code> y <code>Android emulator version …</code>."),
             falla("<code>adb: command not found</code> o <i>no se reconoce</i>: la terminal se abrió antes de "
                   "configurar las variables, o la ruta no coincide con la <i>SDK Location</i> del paso anterior."),
             entender("<code>ANDROID_HOME</code> le dice a Expo dónde está el SDK; el PATH permite escribir "
                      "<code>adb</code> y <code>emulator</code> desde cualquier carpeta.")),
        paso("m3", "Móvil 3 · Crear y encender el teléfono virtual",
             lista("Android Studio → <b>More Actions → Virtual Device Manager → Create Virtual Device</b>.",
                   "Categoría <b>Phone</b> → un teléfono estándar (un Pixel o <i>Medium Phone</i>, no tablet ni "
                   "plegable) → Next.",
                   f"Imagen del sistema: la más reciente estable, {imagen} → Download si hace falta → Finish.",
                   "Pulsa ▶ junto al dispositivo y espera la pantalla de inicio de Android.")
             + "<p>También se enciende desde la terminal (el nombre exacto lo da la primera línea):</p>"
             + cmd("emulator -list-avds", "emulator -avd Medium_Phone_API_37.0")
             + "<p>Con el emulador encendido:</p>" + cmd("adb devices -l"),
             ver("<code>emulator-5554   device   product:sdk_gphone64_x86_64 …</code>: el estado debe ser "
                 "<b>device</b>."),
             falla("<code>offline</code>: Android todavía está arrancando, espera. Lista vacía: el emulador no está "
                   "encendido. Emulador negro o lentísimo: " + acelerar),
             entender("En el autor el asistente instaló Android 17 (API 37). Expo Go funciona en un Android más nuevo "
                      "que el que usa la app para compilar.")),
        paso("m4", "Móvil 4 · Instalar las dependencias de la app (la primera vez)",
             f"<p>En {TERMINAL}:</p>" + cmd(f"cd {ruta('androidstudio', 'stockflow-mobile')}", "npm install"),
             ver("Termina con <code>added … packages</code>. Es normal que avise <i>vulnerabilities</i>: <b>no</b> "
                 "ejecutes <code>npm audit fix --force</code>, cambiaría versiones que Expo necesita fijas."),
             falla("<code>Could not read package.json</code>: no estás en <code>stockflow-mobile</code>."),
             entender("Las librerías nativas se agregan siempre con <code>npx expo install …</code>, que elige la "
                      "versión compatible con el SDK de Expo (58). El proyecto también se puede abrir en WebStorm o "
                      "Android Studio para editar el código.")),
        paso("m5", "Móvil 5 · Encender Metro y abrir la app en el emulador",
             "<p>Con el emulador encendido, en la carpeta de la app:</p>" + cmd("npx expo start --android"),
             ver("Copiado de un arranque real:<ul class='checks'><li><code>Using src/app as the root directory for "
                 "Expo Router.</code></li><li><code>Starting Metro Bundler</code> y, la primera vez, <code>Fetching "
                 "Expo Go</code> → <code>Installing Expo Go on Medium_Phone_API_37.0</code>.</li><li><code>Android "
                 "Bundled 4908ms node_modules/expo-router/entry.js (1285 modules)</code> → la app se envió al "
                 "teléfono.</li></ul>En el emulador aparece <b>StockFlow Mobile</b> con <b>5 Categorías</b> y "
                 "<b>5 Productos</b>."),
             falla("<code>Fetching Expo Go</code> termina en <code>AggregateError [ETIMEDOUT]</code>: la red cortó la "
                   "descarga. Dale más tiempo a Node:" + cmd(expo_red)
                   + "Si Expo Go se queda en su propia pantalla de inicio, ve al paso siguiente."),
             entender("No cierres esa terminal: es Metro. Al guardar un archivo, la app se actualiza sola (Fast "
                      "Refresh). <code>r</code> recarga la app y <code>Ctrl+C</code> detiene Metro.")),
        paso("m6", "Móvil 6 · Si Expo Go no abre la app (Android 17)",
             "<p>Android 17 pide permiso para que las apps entren a la red local, y Expo Go intenta abrir la app en la "
             "IP de tu computadora. Aparece el aviso <i>Local network access needed</i> y la app no carga. En el "
             "emulador no hace falta la red: redirige el puerto de Metro y abre la app por <code>localhost</code>:</p>"
             + cmd("adb reverse tcp:8081 tcp:8081",
                   'adb shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8081" host.exp.exponent'),
             ver("<code>adb reverse --list</code> muestra <code>tcp:8081 tcp:8081</code> y la app carga."),
             falla("Si sigue en blanco, cierra Expo Go (<code>adb shell am force-stop host.exp.exponent</code>), "
                   "espera un segundo y repite la segunda línea. Con Metro detenido, nada carga: revisa el paso 5."),
             entender("<code>adb reverse</code> hace que el <code>localhost:8081</code> del teléfono llegue al "
                      "<code>localhost:8081</code> de tu computadora, donde corre Metro.")),
        paso("m7", "Móvil 7 · Recorrer las pantallas",
             "<p>La app navega con Expo Router (una pantalla por archivo de <code>src/app</code>) y el botón Atrás de "
             "Android:</p>" + tabla(["Acción", "Qué deberías ver"], [
                 ["Explorar categorías", "Cinco categorías; Tecnología marcada <b>INACTIVA</b>"],
                 ["Material de oficina", "Ficha con 2 productos: PRD-OFI-001 y PRD-OFI-002"],
                 ["Mobiliario", "<i>Sin resultados</i>: una categoría puede no tener productos"],
                 ["Tocar PRD-OFI-001", "Ficha del producto y <i>Ver ficha de la categoría →</i>"],
                 ["Atrás de Android", "Vuelve a la pantalla anterior, en orden"],
                 ["Acerca de esta guía → Probar categoría 999", "Mensaje de categoría no encontrada, sin cerrarse"],
                 ["Probar producto con ID inválido", "Mensaje de ID no válido (<code>/productos/abc</code>)"],
             ]),
             ver("Ninguna pantalla roja de error. La app avisa en el Inicio: <i>Datos locales de ejemplo: todavía NO "
                 "existe consumo de API REST</i>."),
             falla("Pantalla roja: lee el archivo y la línea que indica. App vieja en pantalla: detén Metro y "
                   "arráncalo con <code>npx expo start --clear</code>.")),
        paso("m8", "Móvil 8 · Revisar los tipos de TypeScript",
             "<p>En otra terminal, en la carpeta de la app:</p>" + cmd("npx tsc --noEmit"),
             ver("Termina sin mostrar nada (código de salida 0)."),
             falla("Si se ejecuta antes del primer <code>npx expo start</code>, puede quejarse de las rutas: Expo "
                   "genera sus tipos al arrancar. Arranca Metro una vez y repite."),
             entender("El avance, las pruebas y las evidencias de cada guía móvil están en "
                      "<code>androidstudio/stockflow-mobile/docs/</code>.")),
    ])


def apagar() -> str:
    docker = s("Docker Engine: puedes dejarlo encendido o <code>sudo systemctl stop docker</code>. Docker Desktop: "
               "<code>systemctl --user stop docker-desktop</code>",
               "Ícono de la ballena en la barra de menús → <i>Quit Docker Desktop</i>",
               "Ícono de la ballena en la bandeja del sistema → <i>Quit Docker Desktop</i>")
    return capitulo("apagar", "6. Cómo apagar todo", "<p>Al terminar, apaga en este orden:</p>" + tabla(
        ["Qué apagar", "Cómo", "¿Se pierden datos?"], [
            ["La app móvil (Metro)", "Ctrl+C en la terminal de <code>npx expo start</code>", "No (usa datos de ejemplo)"],
            ["El emulador", "Cierra su ventana (o ■ en el Device Manager)", "No"],
            ["La web", "Ctrl+C en la terminal de <code>npm run dev</code>", "No (la web no guarda datos)"],
            ["El backend", f"Cuadrado rojo ■ en la ventana Run de IntelliJ ({ATAJO_STOP})", "No"],
            ["La base de datos", f"<code>cd {ruta()}</code> y <code>docker compose down</code>",
             "No: quedan en un volumen de Docker"],
            ["Docker", docker, "No"],
        ]) + "<h4>Lo que NO debes hacer</h4>" + lista(
        "No uses <code>docker compose down -v</code> salvo que quieras borrar la base: <code>-v</code> borra el "
        "volumen; al volver a arrancar, Flyway recrea las tablas y la semilla original.",
        "No edites <code>V1__…</code>, <code>V2__…</code> ni <code>V3__…</code>: Flyway detecta el cambio y el backend "
        "no arranca. Los cambios de base van en un archivo nuevo (<code>V4__descripcion.sql</code>).",
        "No guardes contraseñas ni tokens en archivos del proyecto, y menos en un <code>.env</code> de la web "
        "(<code>VITE_</code>) o del móvil (<code>EXPO_PUBLIC_</code>): esas variables se publican en la aplicación.",
        "No subas <code>node_modules</code>, <code>dist</code> ni <code>.expo</code> a git y no borres los "
        "<code>package-lock.json</code>.",
        "No abras la web desde <code>http://127.0.0.1:5173</code> ni desde otro puerto: el backend sólo acepta "
        "<code>http://localhost:5173</code> (CORS).", numerada=False))


def rutina() -> str:
    docker = s("<code>sudo systemctl start docker</code> (Engine; no hace falta si lo dejaste habilitado) o "
               "<code>systemctl --user start docker-desktop</code>", "abrir Docker Desktop", "abrir Docker Desktop")
    return capitulo("rutina", "7. Rutina rápida (para los días siguientes)",
                    "<p>Cuando ya hiciste todo una vez, esto es lo único que necesitas:</p><h4>Encender</h4>" + lista(
                        f"Docker: {docker}.",
                        f"<code>cd {ruta()}</code> y <code>docker compose up -d</code>.",
                        "IntelliJ (<code>intellij/stockflow-backend</code>) → ▶ StockFlowApplication → esperar "
                        "<i>Started StockFlowApplication</i>.",
                        f"WebStorm (<code>webstorm/stockflow-frontend</code>) → terminal ({ATAJO_TERMINAL}) → "
                        "<code>npm run dev</code> → <code>http://localhost:5173/login</code>.",
                        "App móvil: encender el emulador → en <code>androidstudio/stockflow-mobile</code>, "
                        "<code>npx expo start --android</code> (en Android 17, además, los dos comandos de "
                        "<i>Móvil 6</i>).")
                    + "<h4>Apagar</h4>" + lista("Ctrl+C en la terminal de Metro y cerrar el emulador.",
                                                "Ctrl+C en la terminal de <code>npm run dev</code>.",
                                                "■ en IntelliJ.", "<code>docker compose down</code>.",
                                                "Docker: " + s("dejarlo encendido (Engine) o <code>systemctl --user "
                                                               "stop docker-desktop</code>", "Quit Docker Desktop",
                                                               "Quit Docker Desktop") + "."))


def problemas() -> str:
    filas_docker = {
        "linux": [
            ["<code>Unit docker.service not found</code>", "Tienes Docker Desktop, no Docker Engine.",
             "<code>systemctl --user start docker-desktop</code> (sin sudo)."],
            ["<code>Cannot connect to the Docker daemon</code>", "Docker está apagado o arrancando.",
             "Paso 1 y espera. Con Docker Desktop, <code>docker context show</code> debe ser "
             "<code>desktop-linux</code>."],
            ["<code>permission denied … docker daemon socket</code>", "Tu usuario no está en el grupo docker.",
             "<code>sudo usermod -aG docker $USER</code>, cierra la sesión y vuelve a entrar."],
            ["<code>'compose' is not a docker command</code>", "Falta Docker Compose.",
             "Ubuntu/Debian: <code>sudo apt install docker-compose-plugin</code>; Arch: <code>sudo pacman -S "
             "docker-compose</code>."],
            ["<code>port is already allocated</code> en el 5432", "Hay otro PostgreSQL encendido.",
             "<code>sudo systemctl stop postgresql</code> (y <code>disable</code>) y <code>docker compose up -d</code>."],
        ],
        "macos": [
            ["<code>Cannot connect to the Docker daemon at unix:///Users/…</code>", "Docker Desktop cerrado o "
             "arrancando.", "Ábrelo y espera <i>Engine running</i>."],
            ["<code>Ports are not available</code> en el 5432", "Otro PostgreSQL (Homebrew o Postgres.app).",
             "<code>brew services stop postgresql@16</code> (o la versión que muestre <code>brew services "
             "list</code>); en Postgres.app, Stop."],
        ],
        "windows": [
            ["<code>error during connect … cannot find the file specified</code>", "Docker Desktop cerrado o "
             "arrancando.", "Ábrelo y espera <i>Engine running</i>."],
            ["<code>WSL 2 installation is incomplete</code> / <code>Virtualization support not detected</code>",
             "Falta WSL 2 o la virtualización está apagada.", "Preparación 2; si hace falta, VT-x/AMD SVM en la BIOS."],
            ["<code>Ports are not available … 0.0.0.0:5432</code>", "Un PostgreSQL de Windows usa el 5432.",
             "Servicios → <i>postgresql-x64-…</i> → Detener (tipo de inicio Manual)."],
        ],
    }[SO]
    filas = filas_docker + [
        ["<code>Connection to localhost:5432 refused</code>", "El contenedor no está corriendo.",
         "Pasos 2 y 3 (<code>docker compose up -d</code>, esperar <i>healthy</i>)."],
        ["<code>password authentication failed for user \"stockflow_admin\"</code>", "La contraseña no coincide o el "
         "backend se conectó a otro PostgreSQL.", "Detén el otro PostgreSQL. Si usas otra <code>DB_PASSWORD</code>, "
         "ponla en IntelliJ: Run → Edit Configurations… → Environment variables."],
        ["<code>Port 8080 was already in use</code>", "Ya hay otro backend corriendo.",
         f"Detén la otra ejecución con ■; si no la encuentras: <code>{puerto(8080)}</code>."],
        ["<code>Found non-empty schema(s) \"stockflow\" but no schema history table</code>", "La base tiene tablas "
         "creadas a mano.", "<code>docker compose down -v</code>, <code>up -d</code> y volver a ejecutar el backend."],
        ["<code>Migration checksum mismatch</code>", "Alguien modificó una migración ya aplicada.",
         "<code>git checkout -- intellij/stockflow-backend/src/main/resources/db/migration/</code>."],
        ["<code>Schema-validation: missing table/column</code>", "Base vieja o cambio sin migración.",
         "<code>git pull</code> en Hector; si sigue, <code>docker compose down -v</code> y <code>up -d</code>."],
        ["No aparece el ▶ verde en StockFlowApplication", "IntelliJ no cargó el proyecto Maven.",
         "Abre <code>intellij/stockflow-backend</code>; clic derecho en <code>pom.xml</code> → Maven → Reload Project."],
        ["<code>invalid source release: 21</code>", "IntelliJ usa otro Java.", "Paso 5 (SDK = 21)."],
        ["Web: <code>npm: command not found</code> / no se reconoce", "Falta Node.js o la terminal es vieja.",
         "Instálalo (capítulo 2) y abre una terminal nueva."],
        ["Web: <code>sh: vite: command not found</code>", "Falta <code>node_modules</code>.",
         "<code>npm install</code> en <code>webstorm/stockflow-frontend</code>."],
        ["Web: <code>Port 5173 is already in use</code>", "Ya hay otro <code>npm run dev</code>.",
         f"Ciérralo con Ctrl+C; si no lo encuentras: <code>{puerto(5173)}</code>."],
        ["Web: login dice <i>El servidor no responde</i>", "El backend está apagado.",
         "Capítulo 3, paso 6; luego vuelve a pulsar <i>Entrar en modo demo</i>."],
        ["Web: recuadro <i>No se pudo conectar con el backend…</i>", "El backend (8080) se detuvo.",
         "Capítulo 3, paso 6; luego F5 o <i>Reintentar</i>."],
        [f"Web, consola ({CONSOLA}): <code>blocked by CORS policy</code>", "La web se abrió desde otra dirección "
         "(127.0.0.1, otro puerto o <code>npm run preview</code>).", "Usa <code>http://localhost:5173</code>."],
        ["Web: página en blanco y <code>Falta VITE_API_URL</code>", "No existe <code>.env.development</code>.",
         "Créalo desde <code>.env.example</code> y reinicia <code>npm run dev</code>."],
        ["Android Studio: <i>Unable to access Android SDK add-on list</i>", "Falló la descarga de componentes "
         "opcionales en el primer arranque.", "Cancel y seguir el asistente (Móvil 1)."],
        ["Móvil: <code>adb: command not found</code>", "Falta el PATH del SDK o la terminal es vieja.",
         "Móvil 2 y terminal nueva."],
        ["Móvil: <code>adb devices</code> vacío u <code>offline</code>", "El emulador no está encendido o arranca.",
         "Encenderlo (Móvil 3) y esperar."],
        ["Móvil: <code>AggregateError [ETIMEDOUT]</code> al <i>Fetching Expo Go</i>", "La red cortó la descarga.",
         "Repetir con <code>NODE_OPTIONS</code> (Móvil 5)."],
        ["Móvil: Expo Go muestra <i>Local network access needed</i> y no abre la app", "Android 17 bloquea la IP "
         "local.", "<code>adb reverse</code> y abrir <code>exp://127.0.0.1:8081</code> (Móvil 6)."],
        ["Móvil: <i>Project is incompatible with this version of Expo Go</i>", "Se abrió una URL o un Expo Go de otra "
         "versión.", "Cerrar Expo Go y abrir de nuevo con <code>npx expo start --android</code> (instala el Expo Go "
         "correcto)."],
        ["Móvil: la app muestra una versión vieja", "Caché de Metro.", "Ctrl+C y <code>npx expo start --clear</code>."],
        ["Móvil: emulador negro o muy lento", "Falta aceleración por hardware.",
         "<code>emulator -accel-check</code> y la nota de Móvil 3."],
    ]
    return capitulo("problemas", "8. Problemas frecuentes y cómo resolverlos",
                    "<p>Busca el mensaje que te aparece (en la terminal, en la ventana Run de IntelliJ, en la consola "
                    f"del navegador con {CONSOLA} o en la terminal de Metro).</p>"
                    + tabla(["Lo que ves", "Qué significa", "Cómo solucionarlo"], filas, "problemas")
                    + nota("Si el error no está en la tabla: copia el primer mensaje en rojo (en el backend, la línea "
                           "<code>Caused by:</code> suele explicar la causa) y pide ayuda al equipo con ese texto "
                           "exacto."))


def glosario() -> str:
    filas = [
        ["Backend", "El programa que procesa las peticiones y guarda los datos. Responde JSON."],
        ["Contenedor · Volumen", "Una “caja” donde corre un programa aislado (aquí, PostgreSQL) y el disco de Docker "
         "donde guarda sus datos."],
        ["localhost · Puerto", "“Esta misma computadora” y el número que identifica a un programa: 5432 PostgreSQL, "
         "8080 backend, 5173 web, 8081 Metro."],
        ["Endpoint · JSON", "Una dirección de la API (<code>GET /api/productos/1</code>) y el formato de texto de los "
         "datos."],
        ["Migración · Flyway", "Archivos SQL numerados (V1, V2, V3) que crean la base; Flyway los aplica en orden."],
        ["Swagger UI", "Página generada automáticamente que documenta la API y permite probarla."],
        ["Maven · npm", "Los gestores de librerías del backend y de la web/móvil."],
        ["Frontend · React · Vite", "La interfaz web; la librería de componentes; la herramienta que la sirve "
         "(<code>npm run dev</code>) y la empaqueta (<code>npm run build</code>)."],
        ["CORS", "Regla del navegador: el backend sólo acepta peticiones de <code>http://localhost:5173</code>."],
        ["Modo demostración", "El login de la web sin autenticación real: no verifica credenciales."],
        ["React Native", "React para apps móviles: <code>View</code> y <code>Text</code> en lugar de "
         "<code>div</code> y <code>p</code>."],
        ["Expo · Expo Go", "Herramientas sobre React Native para crear, ejecutar y compilar la app; Expo Go es la app "
         "de prueba que la muestra sin compilar un APK."],
        ["Metro", "El empaquetador del código de la app mientras programas (puerto 8081)."],
        ["Expo Router", "Navegación por archivos: cada archivo de <code>src/app</code> es una pantalla."],
        ["Android SDK · AVD · adb", "Las herramientas de Android; el teléfono virtual; el comando que habla con él."],
        ["10.0.2.2", "Dentro del emulador, la dirección de tu computadora (allí <code>localhost</code> es el propio "
         "teléfono). La usará la app para llegar al backend desde la guía móvil 08."],
        ["Docker Engine / Desktop" if SO == "linux" else "WSL 2" if SO == "windows" else "Homebrew",
         s("Dos formas de tener Docker en Linux: servicio del sistema sin ventana, o aplicación con ventana.",
           "El instalador de programas de macOS que usa esta guía.",
           "El Linux liviano dentro de Windows donde Docker Desktop ejecuta PostgreSQL.")],
    ]
    return capitulo("glosario", "9. Glosario", tabla(["Término", "Significado simple"], filas, "glosario"))


def indice() -> str:
    filas = "".join(
        f'<div class="i{nivel}"><a href="#{ident}">{titulo}</a><span class="pg" data-id="{ident}"></span></div>'
        for ident, titulo, nivel in INDICE)
    return f'<section class="indice"><h2 class="cap">Índice</h2>{filas}</section>'


CSS = """
@page { size: A4; margin: 17mm 15mm 16mm;
  @top-left { content: "StockFlow (PA-06) · Guía de ejecución paso a paso"; font: 8pt 'DejaVu Sans'; color: #5b6470; }
  @bottom-right { content: "Página " counter(page); font: 8pt 'DejaVu Sans'; color: #5b6470; } }
@page :first { @top-left { content: none; } @bottom-right { content: none; } }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: 'DejaVu Sans', sans-serif; font-size: 9.6pt; line-height: 1.45; color: #1f2328; margin: 0; }
.portada { break-after: page; padding-top: 34mm; text-align: center; }
.p-titulo { font-size: 30pt; font-weight: bold; color: #1f3a5f; }
.p-sub { font-size: 14pt; color: #3b4a5c; margin-top: 4pt; }
.p-version { display: inline-block; margin-top: 10pt; padding: 3pt 12pt; border-radius: 10pt; background: #e8eef7;
  color: #1f3a5f; font-weight: bold; }
.p-proy { margin-top: 22pt; font-size: 12pt; font-weight: bold; }
.p-stack { margin: 10pt 0 26pt; color: #5b6470; line-height: 1.7; }
.portada table.ficha { text-align: left; margin: 0 auto; width: 92%; }
.portada table.ficha td:first-child { font-weight: bold; color: #1f3a5f; width: 22%; }
.p-aviso { margin: 22pt 6% 0; font-size: 8.6pt; color: #5b6470; font-style: italic; }
.indice { break-after: page; }
.indice .i1 { font-weight: bold; margin-top: 7pt; display: flex; }
.indice .i2 { padding-left: 14pt; font-size: 8.8pt; display: flex; }
.indice a { color: inherit; text-decoration: none; flex: 1; }
.indice .pg { min-width: 18pt; text-align: right; color: #5b6470; }
h2.cap { color: #1f3a5f; font-size: 17pt; border-bottom: 2px solid #1f3a5f; padding-bottom: 3pt; margin: 0 0 8pt; }
h2.cap:not(:first-child) { break-before: page; }
h4 { color: #1f3a5f; font-size: 11pt; margin: 12pt 0 5pt; }
section.paso { margin: 12pt 0 4pt; }
section.paso h3 { font-size: 11.5pt; color: #fff; background: #1f3a5f; padding: 4pt 8pt; border-radius: 3pt;
  margin: 0 0 6pt; break-after: avoid; }
p { margin: 4pt 0; }
ol, ul { margin: 4pt 0 4pt 0; padding-left: 18pt; } li { margin-bottom: 2pt; }
code { font-family: 'DejaVu Sans Mono', monospace; font-size: 8.4pt; background: #eef1f5; padding: 0 2pt;
  border-radius: 2pt; }
pre.cmd { background: #1e2530; color: #e6edf3; font-family: 'DejaVu Sans Mono', monospace; font-size: 8.4pt;
  padding: 6pt 9pt; border-radius: 4pt; white-space: pre-wrap; word-break: break-all; margin: 5pt 0;
  break-inside: avoid; }
.caja { border-left: 4px solid; border-radius: 3pt; padding: 4pt 9pt; margin: 5pt 0; break-inside: avoid; }
.caja-t { font-weight: bold; margin-bottom: 2pt; }
.caja.ver { border-color: #2f8f5b; background: #eaf6ef; } .caja.ver .caja-t { color: #2f8f5b; }
.caja.falla { border-color: #c27c0e; background: #fdf4e3; } .caja.falla .caja-t { color: #a8660a; }
.caja.info { border-color: #2f6fb1; background: #e9f1fa; } .caja.info .caja-t { color: #2f6fb1; }
.caja pre.cmd { margin: 4pt 0; }
ul.checks { list-style: none; padding-left: 4pt; } ul.checks li::before { content: "✓ "; color: #2f8f5b; }
.nota { background: #f3f5f8; border: 1px solid #d5dce6; border-radius: 4pt; padding: 6pt 9pt; margin: 8pt 0; }
table { width: 100%; border-collapse: collapse; margin: 5pt 0; font-size: 8.8pt; }
th, td { border: 1px solid #d5dce6; padding: 3.5pt 5pt; text-align: left; vertical-align: top; }
th { background: #e8eef7; color: #1f3a5f; }
tr { break-inside: avoid; }
table.problemas td:first-child { width: 34%; } table.glosario td:first-child { width: 24%; font-weight: bold; }
"""


def documento() -> str:
    cuerpo = "".join([antes_de_empezar(), preparacion(), backend(), frontend(), movil(), apagar(), rutina(),
                      problemas(), glosario()])
    # El índice sigue el orden real de los títulos en el documento, no el orden en que se armó cada paso
    INDICE[:] = [(ident, titulo, 1 if nivel == "2" else 2)
                 for nivel, ident, titulo in re.findall(r'<h([23]) id="([\w-]+)"[^>]*>(.*?)</h\1>', cuerpo)]
    titulo = "Guía de ejecución — StockFlow (PA-06)" + s("", " · macOS", " · Windows")
    return (f'<!doctype html><html lang="es"><head><meta charset="utf-8"><title>{titulo}</title>'
            f"<style>{CSS}</style></head><body>{portada()}{indice()}{cuerpo}</body></html>")


def normalizar(texto: str) -> str:
    return re.sub(r"\s+", " ", texto)


def ubicar(textos: list[str]) -> dict[str, int]:
    """Página de cada entrada del índice: la primera página después del índice donde aparece su título."""
    textos = [normalizar(t) for t in textos]
    numeros, desde = {}, 2
    for ident, titulo, _ in INDICE:
        buscado = normalizar(titulo)[:48]
        for i in range(desde, len(textos)):
            if buscado in textos[i]:
                numeros[ident] = i + 1
                desde = i
                break
    return numeros


def generar(sistema: str) -> None:
    configurar(sistema)
    html = documento()
    with tempfile.TemporaryDirectory() as tmp:
        borrador_html, borrador_pdf = Path(tmp) / "guia.html", Path(tmp) / "borrador.pdf"
        borrador_html.write_text(html, encoding="utf-8")
        imprimir(borrador_html, borrador_pdf)
        numeros = ubicar(paginas(borrador_pdf))
        final = re.sub(r'<span class="pg" data-id="([\w-]+)"></span>',
                       lambda m: f'<span class="pg">{numeros.get(m.group(1), "")}</span>', html)
        borrador_html.write_text(final, encoding="utf-8")
        destinos = SALIDAS[sistema]
        imprimir(borrador_html, destinos[0])
        for copia in destinos[1:]:
            copia.write_bytes(destinos[0].read_bytes())
    faltan = [t for i, t, _ in INDICE if i not in numeros]
    print(f"{sistema}: {destinos[0].relative_to(RAIZ)} ({len(paginas(destinos[0])) - 1} páginas)"
          + (f" · sin número en el índice: {faltan}" if faltan else ""))


if __name__ == "__main__":
    for so in ("linux", "macos", "windows"):
        generar(so)
