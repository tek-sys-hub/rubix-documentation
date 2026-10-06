// Single source of truth for navigation, playground presets and reference tables.

export const VERSION = "0.1.0";
export const RELEASE_DATE = "10 April 2026";
export const REPO_URL = "https://github.com/rubix-lang/rubix";
export const INSTALL_COMMAND = "curl -fsSL https://rubix-lang.dev/install.sh | sh";

export const NAV = [
  {
    id: "getting-started",
    label: "GETTING STARTED",
    icon: "doc",
    items: [
      { id: "introduction", title: "Introduction", summary: "Build fast. Think clearly. Ship with Rubix." },
      { id: "installation", title: "Installation", summary: "Install the compiler toolchain, package manager and environment setup." },
      { id: "first-program", title: "Your First Program", summary: "Step-by-step guide to writing and compiling your initial Rubix program." },
      { id: "project-structure", title: "Project Structure", summary: "Standard file organization, configuration and module hierarchy." },
      { id: "hello-world", title: "Hello World", summary: "The classic introductory code example and runtime breakdown." },
    ],
  },
  {
    id: "language",
    label: "LANGUAGE",
    icon: "code",
    items: [
      { id: "variables", title: "Variables", summary: "Immutable bindings, mut keyword, type annotations and variable shadowing." },
      { id: "data-types", title: "Data Types", summary: "Primitives, floats, booleans, character types and custom scalar types." },
      { id: "operators", title: "Operators", summary: "Arithmetic, comparison, logical, bitwise and assignment operators." },
      { id: "control-flow", title: "Control Flow", summary: "Conditional branching with if-else, while, for loops and match expressions." },
      { id: "functions", title: "Functions", summary: "Function declarations, return values, parameters and anonymous closures." },
      { id: "arrays", title: "Arrays", summary: "Fixed-size arrays, slices, iteration and indexing bounds checking." },
      { id: "strings", title: "Strings", summary: "UTF-8 string slices, string builder, formatting and manipulation methods." },
      { id: "error-handling", title: "Error Handling", summary: "Robust error handling with Result, Option and the ? propagation operator." },
    ],
  },
  {
    id: "advanced",
    label: "ADVANCED",
    icon: "layers",
    items: [
      { id: "structs", title: "Structs", summary: "Custom data structures, fields, constructors and impl methods." },
      { id: "traits", title: "Traits", summary: "Defining shared behavior, interfaces and polymorphism with traits." },
      { id: "generics", title: "Generics", summary: "Writing type-safe, reusable algorithms and generic data structures." },
      { id: "concurrency", title: "Concurrency", summary: "Lightweight green threads, message passing channels and mutex locks." },
      { id: "memory", title: "Memory", summary: "Zero-cost abstractions, memory management, allocators and pointer safety." },
      { id: "modules", title: "Modules", summary: "Organizing codebases with hierarchical modules and pub exports." },
    ],
  },
  {
    id: "standard-library",
    label: "STANDARD LIBRARY",
    icon: "box",
    items: [
      { id: "collections", title: "Collections", summary: "Vec, HashMap, HashSet, BTreeMap and circular ring buffers." },
      { id: "filesystem", title: "Filesystem", summary: "Reading, writing, path manipulation and streaming file I/O." },
      { id: "networking", title: "Networking", summary: "TCP, UDP sockets, HTTP/1.1 and HTTP/2 clients and server APIs." },
      { id: "system", title: "System", summary: "Environment variables, process spawning, signals and platform primitives." },
      { id: "time", title: "Time", summary: "Monotonic clocks, timestamps, durations and asynchronous sleep." },
      { id: "json", title: "JSON", summary: "High-performance streaming JSON serialization and deserialization." },
    ],
  },
];

export const SECTION_ORDER = NAV.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.id, groupLabel: group.label }))
);

export const SECTION_BY_ID = Object.fromEntries(SECTION_ORDER.map((s) => [s.id, s]));

// Presets without `output` are fully handled by the browser preview.
// Presets with `output` use features the preview does not evaluate, so the
// playground shows this recorded output when the code is unchanged.
export const PRESETS = {
  greeting: {
    title: "Greeting",
    code: `fn main() {
    let name = "Developer";
    let language = "Rubix";

    println("Hello, {}!", name);
    println("Welcome to {}!", language);
}`,
  },
  hello: {
    title: "Hello, Rubix",
    code: `fn main() {
    let message = "Hello, Rubix!";
    println(message);
}`,
  },
  calculator: {
    title: "Calculator",
    code: `fn main() {
    let a = 10;
    let b = 32;

    println("{} + {} = {}", a, b, a + b);
    println("{} * {} = {}", a, b, a * b);
    println("{} / {} = {}", b, a, b / a);
}`,
  },
  board: {
    title: "Tic-tac-toe board",
    code: `fn main() {
    println(" X | O | X ");
    println("---+---+---");
    println(" O | X | O ");
    println("---+---+---");
    println(" O | X | X ");
    println("X wins on the diagonal.");
}`,
  },
  reading: {
    title: "Struct and match",
    code: `struct Reading {
    sensor: str,
    celsius: f64,
}

fn describe(r: Reading) -> str {
    match r.celsius {
        ..0.0     => "freezing",
        0.0..20.0 => "cool",
        _         => "warm",
    }
}

fn main() {
    let r = Reading { sensor: "roof", celsius: 14.5 };
    println("{}: {}", r.sensor, describe(r));
}`,
    output: ["roof: cool"],
  },
  fibonacci: {
    title: "Fibonacci",
    code: `fn fib(n: i64) -> i64 {
    if n <= 1 {
        return n;
    }
    fib(n - 1) + fib(n - 2)
}

fn main() {
    let n = 35;
    println("fib({}) = {}", n, fib(n));
}`,
    output: ["fib(35) = 9227465"],
  },
  concurrency: {
    title: "Concurrent tasks",
    code: `import rubix::sync::chan;

fn main() {
    let (tx, rx) = chan::new<str>();

    let first = tx.clone();
    spawn { first.send("worker 1 finished"); };
    spawn { tx.send("worker 2 finished"); };

    println(rx.recv());
    println(rx.recv());
}`,
    output: ["worker 1 finished", "worker 2 finished"],
  },
  webserver: {
    title: "Web server",
    code: `import rubix::net::http::{Server, Request, Response};

fn handle(req: Request) -> Response {
    Response::json({
        "status": "ok",
        "path": req.path(),
    })
}

fn main() {
    let server = Server::bind("127.0.0.1:8080");
    println("listening on http://127.0.0.1:8080");
    server.listen(handle);
}`,
    output: ["listening on http://127.0.0.1:8080"],
  },
  filereader: {
    title: "File reader",
    code: `import rubix::io;

fn main() {
    let config = io::read_to_string("config.toml")
        .unwrap_or("name = \\"rubix-app\\"");
    println(config);
}`,
    output: ['name = "rubix-app"'],
  },
  jsonparser: {
    title: "JSON parser",
    code: `import rubix::json;

fn main() {
    let text = "{\\"name\\": \\"Rubix\\", \\"version\\": \\"0.1.0\\"}";
    let doc = json::parse(text).unwrap();
    println("name: {}, version: {}", doc["name"], doc["version"]);
}`,
    output: ["name: Rubix, version: 0.1.0"],
  },
};

export const DEFAULT_PRESET = "greeting";

export const EXAMPLES = [
  { id: "webserver", title: "Web server", level: "intermediate", topic: "Networking", desc: "An HTTP server that answers every request with a small JSON document. Uses rubix::net::http." },
  { id: "calculator", title: "Calculator", level: "beginner", topic: "Arithmetic", desc: "Integer arithmetic and formatted output. Runs entirely in the browser preview, so you can change the numbers and run it again." },
  { id: "filereader", title: "File reader", level: "intermediate", topic: "Files", desc: "Reads a config file into a string and falls back to a default when the file is missing." },
  { id: "concurrency", title: "Concurrent tasks", level: "advanced", topic: "Concurrency", desc: "Two spawned tasks report back over one channel; main waits for both messages." },
  { id: "jsonparser", title: "JSON parser", level: "intermediate", topic: "Standard library", desc: "Parses a JSON string with rubix::json and reads two fields by key." },
  { id: "board", title: "Tic-tac-toe board", level: "beginner", topic: "Output", desc: "Prints a finished game. A starting point for adding input and a win checker." },
  { id: "fibonacci", title: "Fibonacci", level: "intermediate", topic: "Recursion", desc: "Naive recursive Fibonacci, the program behind the first row of the benchmark table." },
  { id: "reading", title: "Struct and match", level: "beginner", topic: "Types", desc: "A struct, a function that takes it, and a match on numeric ranges." },
];

export const BENCHMARKS = {
  overview: [
    { name: "Rubix", score: 1.0, lead: true },
    { name: "Rust", score: 0.92 },
    { name: "Go", score: 0.78 },
    { name: "C", score: 0.65 },
    { name: "Python", score: 0.42 },
    { name: "JavaScript", score: 0.28 },
  ],
  columns: ["Rubix", "Rust", "Go", "C", "Python", "JS"],
  rows: [
    { test: "Fibonacci, n = 45", unit: "ms", values: ["12.4", "14.2", "18.7", "16.1", "58.2", "102.3"] },
    { test: "JSON parsing", unit: "ms", values: ["8.7", "10.1", "14.5", "11.8", "48.7", "92.0"] },
    { test: "Sort 1M integers", unit: "ms", values: ["34.2", "41.7", "53.8", "47.9", "221.4", "401.7"] },
    { test: "HTTP server", unit: "req/s", values: ["28,400", "24,700", "21,300", "18,300", "7,300", "3,400"] },
  ],
};

export const CLI_COMMANDS = [
  { cmd: "rubix new <name>", desc: "Create a project directory with rubix.toml and src/main.rbx.", example: "rubix new my-service" },
  { cmd: "rubix build", desc: "Compile the project. Debug profile unless --release is given.", example: "rubix build --release" },
  { cmd: "rubix run", desc: "Build, then run the resulting binary. Arguments after -- go to the program.", example: "rubix run -- --port 8080" },
  { cmd: "rubix test", desc: "Compile and run test functions and documentation examples.", example: "rubix test --filter api" },
  { cmd: "rubix fmt", desc: "Rewrite source files in the standard style. --check only reports.", example: "rubix fmt --check" },
  { cmd: "rubix add <pkg>", desc: "Add a dependency to rubix.toml and update rubix.lock.", example: "rubix add rubix-http@1.2" },
  { cmd: "rubix bench", desc: "Run functions marked #[bench] and print timings.", example: "rubix bench" },
  { cmd: "rubix clean", desc: "Delete the target/ directory and the incremental cache.", example: "rubix clean" },
];

export const CLI_FLAGS = [
  { flag: "--release", desc: "Build with the release profile: full optimisation and link-time optimisation." },
  { flag: "--target <triple>", desc: "Cross-compile, for example aarch64-unknown-linux-gnu." },
  { flag: "-v, --verbose", desc: "Print each compiler stage and how long it took." },
  { flag: "-q, --quiet", desc: "Print errors only." },
  { flag: "-h, --help", desc: "Show help for rubix or for a subcommand." },
];

export const API_MODULES = {
  io: {
    title: "rubix::io",
    desc: "Files, standard streams and buffered readers and writers.",
    methods: [
      { sig: "open(path: str) -> Result<File, io::Error>", desc: "Open a file for reading." },
      { sig: "read_to_string(path: str) -> Result<str, io::Error>", desc: "Read a whole file as UTF-8." },
      { sig: "write(path: str, bytes: [u8]) -> Result<(), io::Error>", desc: "Create or truncate a file and write bytes to it." },
      { sig: "println(format: str, args...)", desc: "Write formatted text and a newline to standard output." },
    ],
  },
  net: {
    title: "rubix::net",
    desc: "TCP and UDP sockets, plus an HTTP/1.1 and HTTP/2 client and server.",
    methods: [
      { sig: "TcpListener::bind(addr: str) -> Result<TcpListener, net::Error>", desc: "Listen for TCP connections on an address." },
      { sig: "http::Server::bind(addr: str) -> Server", desc: "Create an HTTP server; call listen with a handler to start it." },
      { sig: "http::get(url: str) -> Result<Response, net::Error>", desc: "Send a GET request and wait for the response." },
    ],
  },
  sync: {
    title: "rubix::sync",
    desc: "Channels, locks and other tools for sharing data between tasks.",
    methods: [
      { sig: "chan::new<T>() -> (Sender<T>, Receiver<T>)", desc: "Create an unbounded multi-producer, single-consumer channel." },
      { sig: "Mutex::new(value: T) -> Mutex<T>", desc: "Wrap a value so only one task can access it at a time." },
      { sig: "WaitGroup::new() -> WaitGroup", desc: "Count outstanding tasks; wait() blocks until the count is zero." },
    ],
  },
  collections: {
    title: "rubix::collections",
    desc: "Growable arrays, hash maps, ordered maps and queues.",
    methods: [
      { sig: "Vec::with_capacity<T>(n: usize) -> Vec<T>", desc: "Create an empty vector with room for n elements." },
      { sig: "HashMap::new<K, V>() -> HashMap<K, V>", desc: "Create an empty hash map." },
      { sig: "RingBuffer::new<T>(capacity: usize) -> RingBuffer<T>", desc: "Create a fixed-size queue that overwrites the oldest element when full." },
    ],
  },
  time: {
    title: "rubix::time",
    desc: "Monotonic clocks, durations and sleeping.",
    methods: [
      { sig: "Instant::now() -> Instant", desc: "Read the monotonic clock." },
      { sig: "Duration::from_millis(ms: u64) -> Duration", desc: "Build a duration from milliseconds." },
      { sig: "sleep(d: Duration)", desc: "Suspend the current task for at least d." },
    ],
  },
  math: {
    title: "rubix::math",
    desc: "Floating-point functions and integer helpers.",
    methods: [
      { sig: "sqrt(x: f64) -> f64", desc: "Square root." },
      { sig: "sin(radians: f64) -> f64", desc: "Sine of an angle in radians." },
      { sig: "clamp<T>(x: T, low: T, high: T) -> T", desc: "Limit x to the range low..=high." },
    ],
  },
};

export const CHANGELOG = [
  {
    version: "0.1.0",
    date: "2026-04-10",
    latest: true,
    changes: [
      "First public release of the language specification and compiler.",
      "Types, pattern matching, functions, closures and zero-copy string slices.",
      "Toolchain commands: rubix new, build, run, test, fmt and add.",
      "Standard library modules: io, net, sync, collections, time and math.",
    ],
  },
  {
    version: "0.0.9",
    date: "2026-03-01",
    changes: [
      "Compiler errors show the offending source line with the span underlined.",
      "Parser rewritten; parsing the standard library is 3.2 times faster.",
      "Channels added to rubix::sync as an experimental API.",
    ],
  },
  {
    version: "0.0.8",
    date: "2026-01-18",
    changes: [
      "Experimental async and await syntax behind a feature flag.",
      "Format strings are now checked at compile time.",
    ],
  },
  {
    version: "0.0.7",
    date: "2025-11-20",
    changes: [
      "First version of the ownership checker.",
      "Import syntax changed from use to import.",
    ],
  },
];

export const SEARCH_INDEX = [
  ...SECTION_ORDER.map((s) => ({ title: s.title, section: s.id, kind: s.groupLabel, text: s.summary })),
  ...CLI_COMMANDS.map((c) => ({ title: c.cmd, section: "cli-reference", kind: "Command", text: c.desc })),
  ...Object.values(API_MODULES).map((m) => ({ title: m.title, section: "api-reference", kind: "Module", text: m.desc })),
];
