import baseWorker from "./worker-v18.js";
import {directoryMetadata, wikiTables} from "./wiki-reference.js";
export { ExistRelay } from "./worker-v18.js";

const WORKER_CACHE_VERSION = "v50";

// Public SAB Wiki tables checked November 11, 2026. Null means unpublished.
// https://stealabrainrot.wiki/wiki/mutations/
// https://stealabrainrot.wiki/wiki/traits/
// https://stealabrainrot.wiki/wiki/traits/seasonal/
// Base income from the client catalog. Debuts from explicitly named new-brainrot sections.
// https://stealabrainrot.wiki/wiki/update-log/
// Missing dates are supplemented by the released records at https://steal-a-brainrot.org/brainrots.
// Keep update-log debut dates where the directory disagrees.
const BRAINROT_CATALOG = [
  ["1x1x1x1",1111111,"2025-11-01"],
  ["25",2500000,"2025-11-29"],
  ["4th Bros",3750000,"2026-07-04"],
  ["67",7500000,"2025-09-13"],
  ["Abyssaloco",33333333,"2026-05-09"],
  ["Admin Lucky Block",0,"2025-09-13"],
  ["Agarrini la Palini",425000,null],
  ["Alessio",85000,"2025-08-23"],
  ["Anpali Babel",280000,"2025-09-06"],
  ["Antonio",125000000,"2025-09-06"],
  ["Appelini",300000,"2026-04-11"],
  ["Aquanaut",245000,"2025-11-01"],
  ["Aquarino",4250000,"2026-06-20"],
  ["Arca Bros",250000000,"2026-10-17"],
  ["Arcadopus",5000000,"2026-01-24"],
  ["Arcadopus Egg",0,null],
  ["Arcadragon",215000000,"2026-04-11"],
  ["Astrolero Cervalero",280000,"2026-03-07"],
  ["Avocadini Antilopini",115,"2025-08-30"],
  ["Avocadini Guffo",225,null],
  ["Avocadorilla",7000,null],
  ["Bacuru and Egguru",16000000,"2026-01-24"],
  ["Ballerina Cappuccina",500,null],
  ["Ballerina Peppermintina",215000,"2025-11-29"],
  ["Ballerino Lololo",200000,null],
  ["Balloon Baboon",23500000,"2026-11-07"],
  ["Bambini Crostini",135,null],
  ["Bambu Bambu Sahur",275000,"2025-10-18"],
  ["Bananita Dolphinita",150,"2025-05-31"],
  ["Bananito",15000000,"2026-04-11"],
  ["Bananito Bandito",16500,"2025-10-04"],
  ["Bananito Skelito",8500000,"2026-10-10"],
  ["Bandito Axolito",1225,"2025-09-06"],
  ["Bandito Bobritto",35,"2025-07-05"],
  ["Baskito",16000000,"2026-04-04"],
  ["Baskito Egg",0,null],
  ["Bat-in-the-Box",22500000,"2026-10-10"],
  ["Bearito Cabinito",72500000,"2026-06-13"],
  ["Beavo Potto",315000,"2026-08-22"],
  ["Bee Loco",13500,"2026-04-19"],
  ["Bee Lucky Block",0,null],
  ["Belula Beluga",290000,"2025-09-13"],
  ["Berenjello Angello",18000,"2026-03-07"],
  ["Berryno",1500000,"2026-04-11"],
  ["Bisonte Giuppitere",325000,"2025-08-23"],
  ["Blackhole Goat",400000,"2025-08-23"],
  ["Bling Luming",2600000,"2026-11-07"],
  ["Blueberrinni Octopusini",1000,null],
  ["Boatito Auratito",525000,"2025-10-18"],
  ["Boba Panda",270000,"2026-01-24"],
  ["Bombardini Tortinii",225000,"2025-08-12"],
  ["Bombardiro Crocodilo",2500,null],
  ["Bombardiro Vaccariro",1000000,"2026-05-23"],
  ["Bombombini Gusini",5000,null],
  ["Boneca Ambalabu",40,null],
  ["Boo Boo Rocket",37500000,"2026-10-10"],
  ["Boppin Bunny",80000000,"2026-04-04"],
  ["Brainrot God Lucky Block",0,null],
  ["Brasilini Berimbini",285000,"2025-09-27"],
  ["Brotinho Elf",0,null],
  ["Brr Brr Patapim",100,null],
  ["Brr es Teh Patipum",225000,null],
  ["Brri Brri Bicus Dicus Bombicus",175,null],
  ["Brunito Marsito",3500000,"2026-01-17"],
  ["Brutto Gialutto",3000,"2025-09-06"],
  ["Bucketoro",18250,"2026-05-23"],
  ["Bufalino Boomberino",32000000,"2026-07-04"],
  ["Buho de Fuego",1850,"2025-10-11"],
  ["Buho de Noelo",267500,"2025-12-13"],
  ["Buho de Volto",2750000,"2026-04-19"],
  ["Buho del Cielo",1350,"2026-03-07"],
  ["Bulbito Bandito Traktorito",205000,"2025-08-09"],
  ["Bumbatron",172500000,"2026-08-08"],
  ["Bunito Bunito Spinito",3000000,"2025-12-31"],
  ["Bunny and Eggy",170000000,"2026-04-04"],
  ["Bunny Bunny Bunny Sahur",2250000,"2026-03-28"],
  ["Bunny Bunny Bunny Sahur Egg",0,null],
  ["Bunny Tralala",270000,"2026-04-04"],
  ["Bunny Tralala Egg",0,null],
  ["Bunnyman",1500000,"2025-12-20"],
  ["Buntteo",850000,"2026-03-28"],
  ["Buntteo Egg",0,null],
  ["Burbaloni Loliloli",200,null],
  ["Burguro And Fryuro",150000000,"2025-10-04"],
  ["Burrito Bandito",4000000,"2025-10-21"],
  ["Burrito Bat",7000000,"2026-08-18"],
  ["Burrito Bat Egg",0,null],
  ["Cacasito Satalito",240000,"2025-08-30"],
  ["Cachorrito Melonito",13000,"2025-10-04"],
  ["Cacto Hipopotamo",50,"2025-07-12"],
  ["Camera Ramena",17000000,"2026-04-19"],
  ["Candi Corni",321000,"2026-10-10"],
  ["Candini Fluffini",57500000,"2026-08-15"],
  ["Candy Candy Sahur",350000000000,null],
  ["Cangurato Gelato",77500000,"2026-07-18"],
  ["Capi Taco",155000,"2025-09-16"],
  ["Capibaro Celestino",1750000,"2026-09-26"],
  ["Capibaro Celestino Egg",0,null],
  ["Capitano Americano",72500000,"2026-07-04"],
  ["Capitano Gullini",22000000,"2026-05-23"],
  ["Capitano Moby",160000000,"2025-11-01"],
  ["Capitano Moby Egg",0,null],
  ["Cappuccino Assassino",75,null],
  ["Cappuccino Clownino",285000,"2025-10-25"],
  ["Caramello Filtrello",1050,"2025-09-06"],
  ["Carloo",13500,"2025-08-23"],
  ["Carrotini Brainini",15000,"2025-08-31"],
  ["Cash or Card",100000000,"2026-04-11"],
  ["Casyni Fattini",2000000000,null],
  ["Cavallo Virtuoso",7500,"2025-07-05"],
  ["Cavallo Virtuoso Egg",0,null],
  ["Caylusaurus",55000000,"2026-06-06"],
  ["Celestial Pegasus",175000000,"2026-02-28"],
  ["Celularcini Viciosini",22500000,"2025-09-13"],
  ["Centrucci Nuclucci",15500,"2025-11-15"],
  ["Cerberus",175000000,"2026-01-10"],
  ["Cerberus Egg",0,null],
  ["Chachechi",400000,"2025-09-13"],
  ["Chef Crabracadabra",600,"2025-06-07"],
  ["Chicken Zombie",5500000,"2026-10-17"],
  ["Chicleteira Bicicleteira",3500000,"2025-07-25"],
  ["Chicleteira Bicicleteira Egg",0,null],
  ["Chicleteira Champeona",19000000,"2026-07-25"],
  ["Chicleteira Cupideira",17500000,"2026-02-07"],
  ["Chicleteira Noelteira",15000000,"2025-12-06"],
  ["Chicleteira Surfeiteira",16000000,"2026-06-20"],
  ["Chicleteirina Bicicleteirina",4000000,"2025-10-11"],
  ["Chicli Chicla",47500000,"2026-09-12"],
  ["Chihuanini Taconini",45000,"2025-09-02"],
  ["Chill Puppy",4000000,"2026-01-24"],
  ["Chill Puppy Egg",0,null],
  ["Chillin Chili",25000000,"2025-09-30"],
  ["Chimnino",14000000,"2025-12-13"],
  ["Chimpanzini Bananini",300,null],
  ["Chipso and Queso",25000000,"2025-10-21"],
  ["Chocco Bunny",1400,"2025-12-06"],
  ["Chrismasmamat",277500,"2025-12-13"],
  ["Churrito Bunnito",21000000,"2026-04-04"],
  ["Churrito Bunnito Egg",0,null],
  ["Cigno Fulgoro",20000000,"2026-03-07"],
  ["Clickerino Crabo",1000,"2025-11-08"],
  ["Cloverat Clapat",60000000,"2026-03-14"],
  ["Clovkur Kurkur",305000,"2026-03-14"],
  ["Co Co Co Sahur",1750000,"2026-10-17"],
  ["Cobra Gelato",77500000,"2026-10-17"],
  ["Coco and Mango",33500000,"2026-05-23"],
  ["Cocoa Assassino",291000,"2025-12-13"],
  ["Cocofanto Elefanto",19000,null],
  ["Cocosini Mama",1200,"2025-08-02"],
  ["Cocoteddy",15000,"2026-05-23"],
  ["Coffin Tung Tung Tung Sahur",0,"2025-11-29"],
  ["Cola Cat",160000000,"2026-09-19"],
  ["Conetto Morsetto",10000000,"2026-08-08"],
  ["Cooki and Milki",155000000,"2025-12-06"],
  ["Corn Corn Corn Sahur",250000,"2025-09-23"],
  ["Crabbo Limonetta",235000,"2025-08-31"],
  ["Craburger",1300000,"2026-06-13"],
  ["Craburger Egg",0,null],
  ["Cuadramat and Pakrahmatmamat",1400000,"2025-11-22"],
  ["Cupcake Koala",60,"2025-11-08"],
  ["Cupid Cupid Sahur",3100000,"2026-02-07"],
  ["Cupid Cupid Sahur Egg",0,null],
  ["Cupid Hotspot",3500000,"2026-02-07"],
  ["Deputy Leopard",18000000,"2026-09-12"],
  ["Digi Narwhal",200000000,"2026-04-19"],
  ["Divino Platypio",160000,"2026-03-07"],
  ["DJ Panda",17500000,"2026-02-28"],
  ["DJ Panda Egg",0,null],
  ["Doi Doi Do",260,"2025-11-08"],
  ["Dolphini Jetskini",294500,"2026-01-24"],
  ["Donkeyturbo Express",7500000,"2025-12-20"],
  ["Draculino",120000000,"2026-09-26"],
  ["Draculino Egg",0,null],
  ["Dragon Aquanini",375000000,"2026-05-23"],
  ["Dragon Cannelloni",250000000,"2025-08-01"],
  ["Dragon Cannelloni Egg",0,null],
  ["Dragon Gingerini",350000000,"2025-12-20"],
  ["Dragon Skeletonini",325000000,"2026-10-10"],
  ["Dug dug dug",35000000,"2025-09-21"],
  ["Duggy Bros",90000000,"2026-04-25"],
  ["Dul Dul Dul",375000,"2025-08-23"],
  ["Dumborino Miracello",315000,"2026-03-07"],
  ["Easter Easter Easter Sahur",1250000,"2026-04-04"],
  ["Easter Easter Easter Sahur Egg",0,null],
  ["Egg Lucky Block",0,null],
  ["Eggdin Egg Egg Dun",310000,"2026-04-04"],
  ["Eggdin Egg Egg Dun Egg",0,null],
  ["Eid Eid Eid Sahur",3500000,"2026-03-21"],
  ["El Gato",300000000000000,null],
  ["Electro Quacko",1850,"2026-04-19"],
  ["Elefanto Frigo",185000000,"2025-09-21"],
  ["Esok Goala",32500000,"2026-06-27"],
  ["Esok Sekolah",30000000,"2025-08-09"],
  ["Espresso Signora",70000,null],
  ["Evil Verity",50000000000000,null],
  ["Eviledon",31500000,"2025-10-11"],
  ["Examen Bros",70000000,"2026-07-25"],
  ["Extinct Ballerina",125000,"2025-09-13"],
  ["Extinct Ballerina Egg",0,null],
  ["Extinct Cannelloni",10000000000,null],
  ["Extinct Elephant",100000000000,null],
  ["Extinct Lucky Block",0,null],
  ["Extinct Matteo",625000,"2025-09-13"],
  ["Extinct Tralalero",450000,"2025-09-13"],
  ["Fang Fang Draculang",24500000,"2026-10-24"],
  ["Fangaro Lupino",7250000,"2026-10-03"],
  ["Festive 67",67000000,"2025-12-13"],
  ["Festive Lucky Block",0,null],
  ["Fishboard",825000,"2026-02-28"],
  ["Fishboard Egg",0,null],
  ["Fishino Clownino",120000000,"2025-11-22"],
  ["Fizzy Soda",17250,"2026-01-24"],
  ["Flancito",3750000,"2026-05-16"],
  ["Flipa Sandala",6000000,"2026-05-09"],
  ["Flippo Marino",316000,"2026-05-23"],
  ["Fluriflura",7,null],
  ["Flying Bros",17000000000000,null],
  ["Flying Dutchman",92500000,"2026-10-10"],
  ["Flying Ghost",2250000000000,null],
  ["Fortunu and Cashuru",130000000,"2026-03-14"],
  ["Foxini Lanternini",115000000,"2026-03-21"],
  ["Fragola La La La",32500000,"2025-09-06"],
  ["Fragrama and Chocrama",100000000,"2025-11-08"],
  ["Frankentteo",700000,"2025-10-11"],
  ["Frigo Camelo",2000,null],
  ["Frio Ninja",265000,"2025-11-01"],
  ["Frio Ninja Egg",0,null],
  ["Frogato Pirato",240,"2025-10-18"],
  ["Frogo Elfo",67,"2025-12-06"],
  ["Frostino Vampiro",17500,"2026-10-03"],
  ["Frullato Framingo",20000000,null],
  ["Futbolini Skatini",4500000,"2026-04-25"],
  ["Ganganzelli Trulala",9000,null],
  ["Gangster Footera",30,null],
  ["Garama and Madundung",50000000,"2025-07-05"],
  ["Gato Celesto",250,"2026-03-07"],
  ["Gattatino Nyanino",35000,null],
  ["Gattino Hydrantino",14500000,"2026-08-29"],
  ["Gattito Tacoto",165000,"2025-09-02"],
  ["Gelatina Volatina",2400000,"2026-08-08"],
  ["Gelato Lumacho",1400000,"2026-06-20"],
  ["Giftini Spyderini",999999,"2025-11-29"],
  ["Ginger Cisterna",293500,"2025-12-06"],
  ["Ginger Gerat",75000000,"2025-12-24"],
  ["Ginger Globo",257500,"2025-12-06"],
  ["Girafa Celestre",20000,null],
  ["Girafini Raftini",18000000,"2026-06-13"],
  ["Glaciator",2300000,"2026-05-09"],
  ["Globa Steppa",27500000,"2026-04-11"],
  ["Glorbo Fruttodrillo",750,"2025-05-31"],
  ["GOAT",950000,"2026-01-17"],
  ["Gobblino Uniciclino",27500000,"2025-11-25"],
  ["Gold and Diamond",85000000,"2026-09-12"],
  ["Gold Egg",0,null],
  ["Gold Elf",0,null],
  ["Gold Gold Gold",45000000,"2026-03-14"],
  ["Gorillo Subwoofero",68000000,"2025-09-06"],
  ["Gorillo Watermelondrillo",8000,"2025-07-25"],
  ["Grabatron",62500000,"2026-07-18"],
  ["Graipuss Medussi",1000000,null],
  ["Graipuss Medussi Egg",0,null],
  ["Granchiello Spiritell",260000,"2025-11-22"],
  ["Granny",4000000,"2026-03-21"],
  ["Griffin",400000000,"2026-03-07"],
  ["Grim Cheese",1600000,"2026-10-10"],
  ["Gub",5000000,"2026-08-29"],
  ["Guerriro Digitale",550000,"2025-08-31"],
  ["Guest 666",66666666,"2025-11-01"],
  ["Gym Bros",42500000,"2026-04-19"],
  ["Harpuccino",14000,"2026-03-07"],
  ["Haunted Lucky Block",0,null],
  ["Headless Horseman",600000000,"2025-10-25"],
  ["Heart Lucky Block",0,null],
  ["Hippo Golazo",1250000,"2026-06-27"],
  ["Hippo Jacuzzo",282500,"2026-09-12"],
  ["Ho Ho Ho Sahur",3250000,"2025-12-06"],
  ["Holy Arepa",14,"2026-03-07"],
  ["Honey Honey Bear",32000000,"2026-08-08"],
  ["Honey Honey Narwhal",950000,"2026-08-22"],
  ["Hopilikalika Hopilikalako",55000000,"2026-04-04"],
  ["Hopilikalika Hopilikalako Egg",0,null],
  ["Horegini Boom",2750000,"2025-10-18"],
  ["Huggy Wuggy",22000000000000,null],
  ["Hydra Bunny",185000000,"2026-04-04"],
  ["Hydra Bunny Egg",0,null],
  ["Hydra Dragon Cannelloni",300000000,"2026-01-24"],
  ["Hydra Serpent",220000000,"2026-09-19"],
  ["Jacko Jack Jack",150000,"2025-10-11"],
  ["Jacko Jakat",41000000,"2026-10-31"],
  ["Jacko Spaventosa",16250,"2025-10-11"],
  ["Jackorilla",315000,"2025-10-25"],
  ["Jelly Moby",175000000,"2026-05-16"],
  ["Jingle Jingle Sahur",12250,"2025-12-06"],
  ["Job Job Job Sahur",700000,"2025-08-16"],
  ["John Doe",7500000,"2026-04-25"],
  ["John Pork",500000000,"2026-05-02"],
  ["Jolly Jolly Sahur",45000000,"2025-12-24"],
  ["Kalika Bros",190000000,"2026-04-19"],
  ["Karker Sahur",725000,"2025-09-27"],
  ["Karkerheart Luvkur",297500,"2026-02-07"],
  ["Karkerkar Kurkur",325000,"2025-08-09"],
  ["Ketchuru and Musturu",42500000,"2025-08-30"],
  ["Ketupat Bros",145000000,"2026-01-24"],
  ["Ketupat Kepat",35000000,"2025-08-23"],
  ["Koala Parabala",200000,"2026-09-12"],
  ["Kraken",200000000,"2026-06-13"],
  ["Krupuk Pagi Pagi",290000,"2025-10-18"],
  ["La Anniversary Grande",50000000,"2026-05-16"],
  ["La Breakfast Combinasion",165000000,"2026-08-08"],
  ["La Casa Boo",100000000,"2025-10-25"],
  ["La Craft Machine",75000000,"2026-09-12"],
  ["La Cucaracha",475000,"2025-09-21"],
  ["La Easter Grande",55000000,"2026-03-31"],
  ["La Extinct Grande",23500000,"2025-09-13"],
  ["La Food Combinasion",90000000,"2026-02-21"],
  ["La Fuse Machine",95000000,"2026-08-15"],
  ["La Ginger Sekolah",75000000,"2025-12-13"],
  ["La Grande Combinasion",10000000,null],
  ["La Grande Combinasion Egg",0,null],
  ["La Jolly Grande",30000000,"2025-12-06"],
  ["La Karkerkar Combinasion",600000,"2025-09-06"],
  ["La Lucky Grande",40000000,"2026-03-17"],
  ["La OG Combinasion",1000000000000,null],
  ["La Romantic Grande",40000000,"2026-02-07"],
  ["La Sahur Combinasion",2000000,"2025-09-06"],
  ["La Secret Combinasion",95000000,"2025-10-04"],
  ["La Spooky Grande",24500000,"2025-10-11"],
  ["La Summer Grande",60000000,"2026-06-20"],
  ["La Supreme Combinasion",200000000,null],
  ["La Taco Combinasion",35000000,"2025-10-28"],
  ["La Vacca Jacko Linterino",850000,"2025-10-11"],
  ["La Vacca Lepre Lepreino",1100000,"2026-03-14"],
  ["La Vacca Prese Presente",600000,"2025-12-06"],
  ["La Vacca Saturno Saturnita",325000,"2025-05-31"],
  ["Las Capuchinas",185000,"2025-09-06"],
  ["Las Sis",17500000,"2025-09-13"],
  ["Las Tralaleritas",650000,"2025-07-12"],
  ["Las Vaquitas Lepreinas",1400000000,null],
  ["Las Vaquitas Saturnitas",750000,"2025-07-25"],
  ["Lavadorito Spinito",45000000,"2025-11-22"],
  ["Lavamanta",28500000,"2026-09-26"],
  ["Lavamanta Egg",0,null],
  ["Lazy Ducky",255000,"2026-04-11"],
  ["Lazyno Raulino",150000000000,null],
  ["Lemonita Splashita",280000,"2026-05-23"],
  ["Leprechaun Lucky Block",0,null],
  ["Lerulerulerule",8750,"2025-08-23"],
  ["Lionel Cactuseli",650,"2025-07-05"],
  ["Lionello Casarello",58500000,"2026-09-26"],
  ["Lionello Casarello Egg",0,null],
  ["List List List Sahur",2000000,"2025-12-06"],
  ["Los 25",10000000,"2025-12-13"],
  ["Los 67",13500000,"2025-10-04"],
  ["Los Abyssalocos",40000000000,null],
  ["Los Admins",95000000,"2026-07-11"],
  ["Los Amigos",130000000,"2026-02-21"],
  ["Los Anniversary Combinasionas",70000000000,null],
  ["Los Antonios",60000000000,null],
  ["Los Arcadragons",80000000000,null],
  ["Los Bananito Skelitos",400000000000,null],
  ["Los Baskitos",5500000000,null],
  ["Los Bat-in-the-Boxs",800000000000,null],
  ["Los Bombinitos",220000,"2025-08-23"],
  ["Los Boo Boo Rockets",1800000000000,null],
  ["Los Bros",24000000,"2025-09-06"],
  ["Los Bunitos",4250000,"2026-04-04"],
  ["Los Bunitos Egg",0,null],
  ["Los Bunny Tralalas",900000000,null],
  ["Los Burguros",2000000000,null],
  ["Los Burrito Bats",1000000000,null],
  ["Los Burritos",8500000,"2025-11-18"],
  ["Los Candi Cornis",75000000000,null],
  ["Los Candies",23000000,"2025-12-13"],
  ["Los Carapaces",80000000000,null],
  ["Los Casa Boos",15000000000,null],
  ["Los Cash or Cards",3500000000,null],
  ["Los Caylusaurus",1200000000000,null],
  ["Los Cerberus",8000000000,null],
  ["Los Chicleteiras",7000000,"2025-09-14"],
  ["Los Chicleteiras Cupideiras",12000000000,null],
  ["Los Chihuaninis",160000,"2025-11-18"],
  ["Los Chillis",75000000,"2026-04-19"],
  ["Los Chimninos",6000000000,null],
  ["Los Chrismasmamats",1000000000,null],
  ["Los Churritos",10000000000,null],
  ["Los Clovkurs",1100000000,null],
  ["Los Clowninos",1100000000,null],
  ["Los Cocos and Mangos",40000000000,null],
  ["Los Combinasionas",15000000,"2025-08-02"],
  ["Los Cookis",7500000000,null],
  ["Los Cornis",3100000,"2026-07-11"],
  ["Los Crocodillitos",55000,"2025-07-25"],
  ["Los Cucarachas",1250000,"2025-11-18"],
  ["Los Cupid Hotspots",3500000000,null],
  ["Los Cupids",30000000,"2026-03-07"],
  ["Los Dragons",425000000,"2026-09-12"],
  ["Los Dragons Aquaninis",80000000000,null],
  ["Los Dragons Duos",7000000000,null],
  ["Los Dragons Skeletoninis",12000000000000,null],
  ["Los Dugy's",2000000000000,null],
  ["Los Duo Lucky Blocks",0,null],
  ["Los Easter Combinasionas",45000000000,null],
  ["Los Easter Sahurs",1800000000,null],
  ["Los Egg Lucky Blocks",0,null],
  ["Los Eggdins",1200000000,null],
  ["Los Elephants",1500000000000,null],
  ["Los Eviledons",35000000000,null],
  ["Los Festive 67",60000000000,null],
  ["Los Festive Lucky Blocks",0,null],
  ["Los Flying Dutchmans",4000000000000,null],
  ["Los Food Combinasionas",1100000000,null],
  ["Los Fortunus",35000000000,null],
  ["Los Fragramas",50000000000,null],
  ["Los Frigos",10000000000,null],
  ["Los Fruits",23000000,null],
  ["Los Garamas",1000000000,null],
  ["Los Gattitos",275000,"2025-11-18"],
  ["Los Ginger Sekolahs",12000000000,null],
  ["Los Gold Gold Golds",18000000000,null],
  ["Los Griffins",500000000000,null],
  ["Los Grim Cheeses",120000000000,null],
  ["Los Hackers",75000000,"2026-04-25"],
  ["Los Headless",3500000000000,null],
  ["Los Heart Lucky Blocks",0,null],
  ["Los Hopilikalakos",25000000000,null],
  ["Los Hotspotsitos",20000000,null],
  ["Los Hydra Bunnies",60000000000,null],
  ["Los Hydra Serpents",12500000000,null],
  ["Los Hydras",40000000000,null],
  ["Los Jackorillas",1600000000,null],
  ["Los Jelly Mobys",80000000000,null],
  ["Los Jobcitos",1500000,"2025-10-04"],
  ["Los John Porks",250000000000,null],
  ["Los Jolly Combinasionas",20000000,"2025-12-24"],
  ["Los Karkerhearts",1200000000,null],
  ["Los Karkeritos",750000,"2025-10-04"],
  ["Los Ketchurus",1100000000,null],
  ["Los Leprechaun Lucky Blocks",0,null],
  ["Los Love Bears",60000000000,null],
  ["Los Love Sahurs",2000000000,null],
  ["Los Luck Luck Luck Sahurs",2000000000,null],
  ["Los Lucky Blocks",0,null],
  ["Los Lucky Combinasionas",80000000000,null],
  ["Los Luvs",800000000,null],
  ["Los Machines",50000000000,null],
  ["Los Mariachis",30000000,null],
  ["Los Matteos",325000,"2025-08-16"],
  ["Los Meowls",650000000000,null],
  ["Los Mi Gatitos",6500000,"2026-01-31"],
  ["Los Mobilis",8500000,"2025-10-11"],
  ["Los Mobys",1500000000,null],
  ["Los Mummys",850000000,null],
  ["Los Narwhals",50000000000,null],
  ["Los Noo My Eggs",3000000000,null],
  ["Los Noo my Golds",4000000000,null],
  ["Los Noo my Hearts",6000000000,null],
  ["Los Noobinis",12500,"2025-09-06"],
  ["Los Nooo My Hotspotsitos",5500000,"2025-09-02"],
  ["Los Ogs",400000000000,null],
  ["Los Orcalitos",235000,"2025-08-09"],
  ["Los Pancakes",90000000000,null],
  ["Los Pandaninis",1200000000,null],
  ["Los Patteos",1000000000,null],
  ["Los Pegasus",175000000000,null],
  ["Los Phoenix",50000000000,null],
  ["Los Planitos",18500000,"2025-11-22"],
  ["Los Plant Bros",5000000000,null],
  ["Los Primos",31000000,"2025-09-27"],
  ["Los Puggies",40000000,"2025-11-08"],
  ["Los Pumpkinis",2500000000,null],
  ["Los Quackinis",50000000000,null],
  ["Los Quesadillas",4500000,"2025-11-18"],
  ["Los Rabbitos Clockitos",3350000000000,null],
  ["Los Ramenas",25000000000,null],
  ["Los Reindeers",4000000000,null],
  ["Los Reinitos",25000000000,null],
  ["Los Ricos",50000000000,null],
  ["Los Rivals",750000000000,null],
  ["Los Romantic Combinasionas",2500000000,null],
  ["Los Rosettis",25000000000,null],
  ["Los Roseys",3500000000,null],
  ["Los Rubrikikos",40000000000,null],
  ["Los Sammyni Cakinis",60000000000,null],
  ["Los Sammynis Spookynis",90000000000,null],
  ["Los Santas",2500000000,null],
  ["Los Secret Combinasionas",150000000,"2026-07-25"],
  ["Los Secret Lucky Blocks",0,null],
  ["Los Secrets",3000000000,null],
  ["Los Sekolahs",110000000,"2026-02-21"],
  ["Los Sigmas",2300000,"2026-07-11"],
  ["Los Skibidis",100000000000,null],
  ["Los Skull Lucky Blocks",0,null],
  ["Los Smurf Cats",1000000000000,null],
  ["Los Snailo Cloveros",8000000000,null],
  ["Los Spaghettis",70000000,"2025-11-08"],
  ["Los Spooky Combinasionas",20000000,"2025-10-25"],
  ["Los Spooky Lucky Blocks",0,null],
  ["Los Spookys",2300000000,null],
  ["Los Spyder Elephants",500000000000,null],
  ["Los Spyderinis",425000,"2025-08-23"],
  ["Los Steakinis Fattinis",1000000000000,null],
  ["Los Supreme Combinasionas",15000000000,null],
  ["Los Sweethearts",16500000,"2026-02-14"],
  ["Los Taco Blocks",0,null],
  ["Los Tacoritas",32000000,"2025-09-21"],
  ["Los Tacos",125000000000,null],
  ["Los Tangcitos",42500000,"2026-07-11"],
  ["Los Telemortes",8000000000,null],
  ["Los Tictacs",60000000,"2026-07-11"],
  ["Los Tipi Tacos",260000,"2025-09-02"],
  ["Los Tirilikalakos",40000000000,null],
  ["Los Tortus",500000,"2025-10-04"],
  ["Los Tralaleritos",500000,"2025-06-07"],
  ["Los Treaters",1200000,"2026-10-03"],
  ["Los Trickolinos",4500000000,null],
  ["Los Trios",700000,"2026-01-24"],
  ["Los Triplitos",1600000000,null],
  ["Los Trolls",2250000000000,null],
  ["Los Tungtungtungcitos",210000,null],
  ["Los Zombie Bowls",200000000000,null],
  ["Love Love Bear",225000000,"2026-02-07"],
  ["Love Love Love Sahur",1000000,"2026-02-07"],
  ["Lovin Rose",32500000,"2026-02-07"],
  ["Luck Luck Luck Sahur",3750000,"2026-03-14"],
  ["Lumaca Malefica",265000,"2026-05-09"],
  ["Luv Luv Luv",282500,"2026-02-07"],
  ["Magi Ribbitini",11500,"2025-10-11"],
  ["Malame Amarele",140,"2025-09-06"],
  ["Mangolini Parrocini",235,"2025-09-06"],
  ["Mariachi Corazoni",12500000,"2025-09-21"],
  ["Mariachi Skeletoni",630000000000,null],
  ["Marino Submarino",3600000,"2026-09-26"],
  ["Marino Submarino Egg",0,null],
  ["Mastodontico Telepiedone",275000,"2025-08-31"],
  ["Matteo",50000,null],
  ["Medusini and Demonini",180000000,"2026-10-17"],
  ["Meowl",600000000,"2025-10-18"],
  ["Mi Gatito",3250000,"2026-01-31"],
  ["Mieteteira Bicicleteira",26000000,"2025-10-18"],
  ["Moby Bros",225000000,"2026-07-11"],
  ["Money Money Bros",47000000,"2026-04-25"],
  ["Money Money Cat",14500000,"2026-10-24"],
  ["Money Money Man",65000,"2025-11-08"],
  ["Money Money Puggy",21000000,"2025-09-27"],
  ["Money Money Reindeer",25000000,"2025-12-24"],
  ["Mortaruga",324000,"2026-10-03"],
  ["Motorino Bumbino",16500000,"2026-08-22"],
  ["Mummelo Bandello",285000,"2026-10-03"],
  ["Mummio Rappitto",325,"2025-10-11"],
  ["Mummy Ambalabu",250000,"2025-10-25"],
  ["Mythic Lucky Block",0,null],
  ["Nacho Spyder",50000000,"2026-03-03"],
  ["Nachorilla",47500000,"2026-08-18"],
  ["Naughty Naughty",3000000,"2025-12-13"],
  ["Noo La Polizia",280000,"2025-11-08"],
  ["Noo my Candy",5000000,"2025-10-25"],
  ["Noo my Eggs",7000000,"2026-03-28"],
  ["Noo my Eggs Egg",0,null],
  ["Noo my Examen",32500000,null],
  ["Noo my examine",32500000,"2025-09-27"],
  ["Noo my Gold",13500000,"2026-03-14"],
  ["Noo my Heart",13000000,"2026-02-07"],
  ["Noo my Present",6000000,"2025-12-13"],
  ["Noo my Resume",32500000,"2026-08-01"],
  ["Noobini Pizzanini",1,null],
  ["Noobini Santanini",11,"2025-12-06"],
  ["Noodle Noodle Poodle",27500000,"2026-07-18"],
  ["Nooo My Hotspot",1500000,"2025-08-12"],
  ["Nuclearo Dinossauro",15000000,null],
  ["Octo Lucky Block",0,null],
  ["Octoball",3250000,"2026-06-13"],
  ["Odin Din Din Dun",75000,"2025-05-31"],
  ["OG Bros",900000000000,null],
  ["Ombrello Topolino",6500000,"2026-05-23"],
  ["Oni Oni Panda",27000000,"2026-10-03"],
  ["Orangutini Ananassini",2100,"2025-06-07"],
  ["Orbi Mochi",46000000,"2026-04-19"],
  ["Orcaledon",40000000,"2025-11-15"],
  ["Orcalero Orcala",100000,null],
  ["Orcalita Orcala",240000,"2025-09-06"],
  ["Orchidox",215000000,"2026-08-22"],
  ["Pakrahmatmamat",215000,"2025-08-23"],
  ["Pakrahmatmatina",225000,"2025-10-18"],
  ["Pancake and Syrup",125000000,"2026-04-11"],
  ["Panda Popanda",67000000,"2026-09-12"],
  ["Pandaccini Bananini",1250,"2025-07-12"],
  ["Pandanini Frostini",294000,"2025-12-13"],
  ["Paradiso Axolottino",900000,"2026-03-07"],
  ["Patteo",287500,"2026-03-14"],
  ["Pelican Pachetto",1750000,"2026-09-12"],
  ["Pengolino Nuvoletto",72,"2026-03-07"],
  ["Penguin Tree",270,"2025-12-06"],
  ["Penguino Cocosino",300,"2025-08-02"],
  ["Penguino Pumpkino",235,"2026-10-03"],
  ["Perochello Lemonchello",160,null],
  ["Perrito Burrito",1000000,"2025-09-30"],
  ["Peschito Machito",19000000,"2026-08-08"],
  ["Phoenix",425000000,"2026-10-03"],
  ["Pi Pi Watermelon",1300,"2025-08-02"],
  ["Piccione Macchina",225000,"2025-07-25"],
  ["Piccionetta Macchina",270000,"2025-09-06"],
  ["Pin Pin Pengu",2300000,"2026-09-26"],
  ["Pin Pin Pengu Egg",0,null],
  ["Pinealotto Fruttarino",75,"2025-10-11"],
  ["Pineaplino",200000,"2026-04-11"],
  ["Pipi Avocado",70,"2025-08-02"],
  ["Pipi Corni",14,"2025-08-02"],
  ["Pipi Kiwi",13,null],
  ["Pipi Potato",1100,"2025-08-23"],
  ["Pirulitoita Bicicleteira",2500000,"2025-11-08"],
  ["Pizza and Ranch",130000000,"2026-07-25"],
  ["Plant Bros",300000000,"2026-10-03"],
  ["Please my Present",1300000,"2025-12-06"],
  ["Pogo Pogo Penguin",12500000,"2026-08-08"],
  ["Polaroidini",55000000,"2026-08-11"],
  ["Pop Pop Petalini",62500000,"2026-08-22"],
  ["Pop Pop Sahur",295000,"2025-10-04"],
  ["Popcuru and Fizzuru",115000000,"2026-01-31"],
  ["Pot Hotspot",2500000,null],
  ["Pot Pumpkin",3000000,"2025-10-25"],
  ["Premium Bee Lucky Block",0,null],
  ["Premium Egg Lucky Block",0,null],
  ["Premium Festive Lucky Block",0,null],
  ["Premium Haunted Lucky Block",0,null],
  ["Premium Heart Lucky Block",0,null],
  ["Premium Leprechaun Lucky Block",0,null],
  ["Premium Octo Lucky Block",0,null],
  ["Premium Skull Lucky Block",0,null],
  ["Pretzo Robo",52500000,"2026-04-19"],
  ["Puffaball",1500,"2025-11-22"],
  ["Puffino Builderino",31000000,"2026-08-29"],
  ["Pum Pum Pum",31000000,"2026-10-24"],
  ["Pumpkini Spyderini",650000,"2025-10-25"],
  ["Puppetmaster",177500000,"2026-10-31"],
  ["Qamar Camelamp",3300000,"2026-09-26"],
  ["Qamar Camelamp Egg",0,null],
  ["Quackalena",265000,"2026-08-08"],
  ["Quackini Snackini",65000000,"2026-04-04"],
  ["Quackini Snackini Egg",0,null],
  ["Quackula",1275,"2025-10-11"],
  ["Queen Bee",65000000,"2026-08-08"],
  ["Quesadilla Crocodila",3000000,"2025-09-16"],
  ["Quesadillo Vampiro",3500000,"2025-10-21"],
  ["Quivioli Ameleonni",900,"2025-08-30"],
  ["Rabbito Clockito",20000000000000,null],
  ["Raccooni Jandelini",12,"2025-08-23"],
  ["Rang Ring Bus",6000000,"2025-10-18"],
  ["Ranito Pepito",950000,"2026-09-26"],
  ["Ranito Pepito Egg",0,null],
  ["Reapero Reapala",170000000000,null],
  ["Ref Ref Ref Sahur",2750000,"2026-06-27"],
  ["Reindeer Tralala",600000,"2025-12-06"],
  ["Reinito Sleighito",140000000,"2025-12-13"],
  ["Rexino Ramino",2600000,"2026-09-26"],
  ["Rexino Ramino Egg",0,null],
  ["Rhino Helicopterino",11000,"2025-09-13"],
  ["Rhino Toasterino",2150,null],
  ["Rico Dinero",42500000,"2026-04-11"],
  ["Robo Grafito",317500,"2026-05-09"],
  ["Rocco Disco",650000,"2025-12-31"],
  ["Rockarino Rockara",3000000,"2026-09-26"],
  ["Rockarino Rockara Egg",0,null],
  ["Rocketini Frostini",3000000,null],
  ["Rosatops Triceratino",3100000,"2026-08-22"],
  ["Rosetti Tualetti",50000000,"2026-02-07"],
  ["Rosey and Teddy",165000000,"2026-02-07"],
  ["Rubiko and Kubiko",72500000,"2026-07-18"],
  ["Rubrikiko",70000000,"2026-05-09"],
  ["S'more Serat",85000000,"2026-08-08"],
  ["Sakumini Tuffini",150000000000,null],
  ["Salamino Penguino",250,"2025-07-25"],
  ["Sammyni Cakini",85000000,"2026-05-16"],
  ["Sammyni Fattini",70000000,"2026-02-21"],
  ["Sammyni Spookyni",80000000,"2026-10-03"],
  ["Sammyni Spyderini",330000,"2025-07-05"],
  ["Sammyni Spyderini Egg",0,null],
  ["Sammyni Truckini",110000000,"2026-08-18"],
  ["Sand Sand Sand",30000000,"2026-06-13"],
  ["Santa Hotspot",2600000,"2025-12-13"],
  ["Santteo",800000,"2025-12-06"],
  ["Scarino Crowino",135000000,"2026-10-31"],
  ["Scorpi Inferni",76000000,"2026-10-31"],
  ["Scorpino Coasterino",47500000,"2026-08-08"],
  ["Sealo Regalo",1825,"2025-12-06"],
  ["Secret Lucky Block",0,null],
  ["Serafinna Medusella",5500000,"2026-03-07"],
  ["Seraphino Gruyero",1900,"2026-03-07"],
  ["Sigma Boy",1350,"2025-08-01"],
  ["Sigma Girl",1800,"2025-09-21"],
  ["Signore Carapace",275000000,"2025-09-06"],
  ["Sir Mangus",7500000,"2026-08-29"],
  ["Sir Mangus Egg",0,null],
  ["Skelly and Coffy",155000000,"2026-10-17"],
  ["Ski Ski Skunki",1600000,"2026-09-26"],
  ["Ski Ski Skunki Egg",0,null],
  ["Skibidi Toilet",450000000,"2025-12-27"],
  ["Skooter Skelly",2600000,"2026-10-24"],
  ["Skul Skuli Skuli",300000,"2026-10-24"],
  ["Skull Lucky Block",0,null],
  ["Skull Skull Skull",290000,"2025-10-25"],
  ["Slushi Huski",322500,"2026-10-17"],
  ["Smurf Cat",1000000000000,null],
  ["Snailenzo",250000,"2025-10-11"],
  ["Snailo Clovero",18500000,"2026-03-14"],
  ["Spaghetti Tualetti",60000000,"2025-08-30"],
  ["Spinny Hammy",17000000,"2026-01-24"],
  ["Spioniro Golubiro",3500,null],
  ["Spongini Boyini",5000000000,null],
  ["Spongini Quackini",13000,"2026-01-24"],
  ["Spooketti Tualetti",77500000,"2026-10-24"],
  ["Spooky and Pumpky",80000000,"2025-10-11"],
  ["Spooky Bros",10000000000,null],
  ["Spooky Kart",13000000,"2026-10-31"],
  ["Spooky Lucky Block",0,null],
  ["Spooky Spooky Sahur",46000000,"2026-10-24"],
  ["Spyder Elephant",1000000000,"2026-05-16"],
  ["Squalanana",250000,"2025-10-04"],
  ["Starini Infinitiny",5000000000,null],
  ["Steakini Fattini",55000000,"2026-05-30"],
  ["Stoppo Luminino",8000,"2025-11-08"],
  ["Strawberrelli Flamingelli",1150,null],
  ["Strawberrita",6500000,"2026-04-11"],
  ["Strawberry Elephant",750000000,"2025-08-30"],
  ["Sundrilla Sundae",180000,"2026-05-23"],
  ["Sushi Inu",8000000,"2026-06-13"],
  ["Svinina Bombardino",10,"2025-05-31"],
  ["Swag Soda",13000000,"2025-11-15"],
  ["Swag Soda Egg",0,null],
  ["Swaggy Bros",40000000,"2025-12-16"],
  ["Syrup Samurai",6700000,"2026-08-22"],
  ["Ta Ta Ta Ta Sahur",55,"2025-05-31"],
  ["Taco Lucky Block",0,null],
  ["Tacorillo Crocodillo",12500000,"2026-03-03"],
  ["Tacorita Bicicleta",16500000,"2025-09-16"],
  ["Tacoturbo Tacorito",26000000,"2026-08-18"],
  ["Talpa Di Fero",9,null],
  ["Tang Tang Keletang",33500000,"2025-09-27"],
  ["Tartaragno",13,"2025-10-11"],
  ["Tartaruga Cisterna",250000,"2025-08-23"],
  ["Tartaruga Cisterna Egg",0,null],
  ["Te Te Te Sahur",9500,"2025-08-09"],
  ["Telemorte",2000000,"2025-10-25"],
  ["Tenini Ballini",320000,"2026-07-18"],
  ["Tentacolo Tecnico",292500,"2025-10-11"],
  ["Ti Ti Ti Sahur",225,"2025-08-02"],
  ["Tic Tic Pumpkin",105000000000,null],
  ["Tic Tic Ribbit",18750,"2026-08-08"],
  ["Tic Tic Rick",295000,null],
  ["Tictac Sahur",37500000,"2025-09-21"],
  ["Tigrilini Watermelini",6500,null],
  ["Tigroligre Frutonni",60000,null],
  ["Tim Cheese",5,null],
  ["Tipi Topi Taco",75000,"2025-08-12"],
  ["Tirilikalika Tirilikalako",82500000,"2025-09-06"],
  ["To to to Sahur",2250000,"2025-09-21"],
  ["To to to Sahur Egg",0,null],
  ["Tob Tobi Tobi",8500,null],
  ["Toiletto Focaccino",16000,"2025-09-27"],
  ["Tootini Shrimpini",260000,"2025-12-31"],
  ["Toro Españolo",2200000,"2026-07-25"],
  ["Torrtuginni Dragonfrutini",350000,null],
  ["Tortuginni Sandcastlini",317500,"2026-06-13"],
  ["Tosto Dino",27000000,"2026-10-13"],
  ["Tracoducotulu Delapeladustuz",12000,"2025-08-16"],
  ["Tractoro Dinosauro",230000,"2025-09-13"],
  ["Tralaledon",27500000,"2025-09-06"],
  ["Tralalero Tralala",50000,null],
  ["Tralalita Tralala",100000,"2025-08-16"],
  ["Tree Tree Tree Sahur",17000,"2025-12-06"],
  ["Trenostruzzo Turbo 3000",150000,null],
  ["Trenostruzzo Turbo 4000",335000,"2025-09-06"],
  ["Trenotubo Axolotrico 9000",255000,"2026-04-19"],
  ["Tric Trac Baraboom",65,null],
  ["Trickolino",900000,"2025-10-25"],
  ["Triplito Tralaleritos",875000,"2025-12-13"],
  ["Trippi Troppi",15,null],
  ["Trippi Troppi Troppa Trippa",175000,"2025-08-01"],
  ["Trulimero Trulicina",125,null],
  ["Tuff Toucan",26000000,"2025-12-31"],
  ["Tukanno Bananno",100000,null],
  ["Tung Tung Tung Sahur",1500000,"2025-11-29"],
  ["Unclito Samito",75000,"2025-07-05"],
  ["Urubini Flamenguini",150000,"2025-08-16"],
  ["Vampi Ribbitini",185000,"2026-10-03"],
  ["Vampira Cappucina",125000,"2025-10-11"],
  ["Vampire Skeleton",700000000000,null],
  ["Var Var Var",5500000,"2026-07-04"],
  ["Ventoliero Pavonero",65000000,"2026-02-28"],
  ["Venuspino",175000000,null],
  ["Vulturino Skeletono",500000,"2025-10-11"],
  ["W or L",30000000,"2025-11-22"],
  ["Wheelchair Granny",0,null],
  ["Witch Skeleton",1000000000000,null],
  ["Wombo Rollo",275,"2025-11-01"],
  ["Yess my Examen",575000,null],
  ["Yess my examine",575000,"2025-09-27"],
  ["Yess my Resume",2100000,"2026-08-01"],
  ["Yeti Claus",257500,"2025-12-06"],
  ["Yetimatic",87500000,"2026-08-08"],
  ["Yetimatic Egg",0,null],
  ["Zebrino Pianino",7250000,"2026-09-19"],
  ["Zebrino Pianino Egg",0,null],
  ["Zibra Zubra Zibralini",6000,null],
  ["Zombie Bowl",4500000,"2026-10-10"],
  ["Zombie Tralala",500000,"2025-10-11"]
];
const LATEST_BRAINROTS = ["Balloon Baboon", "Bling Luming"];
const LATEST_BRAINROTS_EXPIRES = Date.parse("2026-11-14T00:00:00-06:00");

const WIKI_MUTATIONS = [
  ["Default",1,null],
  ["Gold",1.25,"2025-05-31"],
  ["Diamond",1.5,"2025-05-31"],
  ["Rainbow",10,"2025-06-21"],
  ["Bloodrot",2,"2025-06-07"],
  ["Candy",4,"2025-07-05"],
  ["Lava",6,"2025-07-25"],
  ["Galaxy",7,"2025-08-23"],
  ["Yin Yang",7.5,"2025-09-27"],
  ["Radioactive",8.5,"2025-11-15"],
  ["Cursed",9,"2026-01-03"],
  ["Divine",10,"2026-02-21"],
  ["Cyber",11,"2026-04-18"],
  ["Phantom",12,"2026-06-13"],
  ["Crystal",13,"2026-07-25"],
  ["Eclipse",14,"2026-10-03"]
];
const WIKI_TRAITS = [
  ["Bat",null],
  ["Money",null],
  ["Strawberry",8],
  ["Meowl",7],
  ["John Pork",6.5],
  ["Skibidi",6],
  ["Granny",5.5],
  ["Fire",5],
  ["Rose",5],
  ["Fireworks",5],
  ["Nyan",5],
  ["Lightning",5],
  ["Burger",4.5],
  ["Aura Shades",4.5],
  ["Disco",4],
  ["Glitched",4],
  ["Claws",4],
  ["Zombie",4],
  ["Bubblegum",3],
  ["Taco",2],
  ["UFO",2],
  ["Sleepy",0.5],
  ["Bull",null],
  ["Paint",5],
  [":3",4.5],
  ["Tie",3.75],
  ["Spider",3.5],
  ["Matteo Hat",3.5],
  ["Galactic",3],
  ["Explosive",3],
  ["Shark Fin",3],
  ["Job Application",null],
  ["Reindeer Pet",5],
  ["Santa Hat",4],
  ["Jack O' Lantern Pet",4.5],
  ["RIP Gravestone",3.5],
  ["Witch Hat",3],
  ["Bunny Ears",4.5],
  ["Pink Egg",6.5],
  ["Blue Egg",5],
  ["Green Egg",4],
  ["Orange Egg",3],
  ["1 Year",5.5],
  ["26",5],
  ["10B",3],
  ["Rainbow Balloon",6.5],
  ["Pink Balloon",5.5],
  ["Red Balloon",5],
  ["Blue Balloon",4],
  ["Green Balloon",3.5],
  ["Orange Balloon",3],
  ["Halo",5],
  ["Bee",null],
  ["Fire Bee",null],
  ["Ice Bee",null],
  ["Queen Bee",null],
  ["Lucky",5],
  ["Sun",5],
  ["Ball",5],
  ["Chocolate",4.5],
  ["Skeleton",3],
  ["Brazil",5],
  ["Indonesian",4],
  ["Sombrero",4],
  ["Algeria",4.5],
  ["Argentina",4.5],
  ["Australia",4.5],
  ["Austria",4.5],
  ["Belgium",4.5],
  ["Bosnia and Herzegovina",4.5],
  ["Canada",4.5],
  ["Cape Verde",4.5],
  ["Colombia",null],
  ["Croatia",4.5],
  ["Curacao",4.5],
  ["Czechia",4.5],
  ["DR Congo",4.5],
  ["Ecuador",4.5],
  ["Egypt",4.5],
  ["England",4.5],
  ["France",4.5],
  ["Germany",4.5],
  ["Ghana",4.5],
  ["Haiti",4.5],
  ["Iran",4.5],
  ["Iraq",4.5],
  ["Ivory Coast",4.5],
  ["Japan",4.5],
  ["Jordan",4.5],
  ["Mexico",4.5],
  ["Morocco",4.5],
  ["Netherlands",4.5],
  ["New Zealand",4.5],
  ["Norway",4.5],
  ["Panama",4.5],
  ["Paraguay",4.5],
  ["Portugal",4.5],
  ["Qatar",4.5],
  ["Saudi Arabia",4.5],
  ["Scotland",4.5],
  ["Senegal",4.5],
  ["South Africa",4.5],
  ["South Korea",4.5],
  ["Spain",4.5],
  ["Sweden",4.5],
  ["Switzerland",4.5],
  ["Tunisia",4.5],
  ["Turkey",4.5],
  ["United States",4.5],
  ["Uruguay",4.5],
  ["Uzbekistan",4.5],
  ["Comet-struck",2.5],
  ["Snowy",2],
  ["Wet",1.5]
];

// Trait dates from the supplied roster. Only documented values support exact lookups.
// https://stealabrainrot.wiki/wiki/witching-hour-event/
// https://stealabrainrot.wiki/wiki/update-log/update-08/
// https://stealabrainrot.wiki/wiki/update-log/update-39/
const TRAIT_RELEASES = {
  "26": ["reported","New Year's Machine – Jan 1, 2026"],
  "Strawberry": ["reported","Released Aug 30, 2025 – Update 14"],
  "Meowl": ["reported","Released Oct 18, 2025 – Update 21"],
  "John Pork": ["reported","Released May 2, 2026 – Update 49"],
  "Skibidi": ["reported","Released Dec 27, 2025 – Update 31"],
  "Granny": ["reported","Released Mar 21, 2026 – Update 43"],
  "Fire": ["reported","Released June 2025 – Update 5+"],
  "Rose": ["reported","Released Jan 17, 2026 – Update 34"],
  "Fireworks": ["reported","Released July 4–5, 2025 – Update 6"],
  "Nyan": ["reported","Released June 28, 2025 – Update 5"],
  "Lightning": ["reported","Released Summer 2025 – Admin Abuse"],
  "Burger": ["reported","Released May 30, 2026 – Update 52.5"],
  "Aura Shades": ["reported","Released June 6, 2026 – Update 52.75"],
  "Disco": ["reported","Released Summer 2025 – Admin Abuse"],
  "Glitched": ["reported","Released July 18, 2025 – Update 8"],
  "Claws": ["reported","Released Summer 2025 – Admin Abuse"],
  "Zombie": ["reported","Released Nov 15, 2025 – Update 25"],
  "Bubblegum": ["documented","2025-07-18"],
  "Taco": ["reported","Released June 28, 2025 – Update 5"],
  "UFO": ["reported","Released Summer 2025 – Admin Abuse"],
  "Sleepy": ["reported","Released Summer 2025 – Admin Abuse"],
  "Bull": ["reported","Released July 25, 2026 – Update 59 / Spain Event"],
  "Paint": ["reported","Chicleteira Bicicleteira Ritual – Late 2025"],
  ":3": ["reported","Mi Gatito Ritual – Jan 31, 2026 / Update 36"],
  "Tie": ["reported","Dul Dul Dul Ritual – Late 2025"],
  "Spider": ["reported","Sammyni Spyderini Ritual – Aug 23, 2025 / Update 13"],
  "Matteo Hat": ["reported","Matteo Ritual – Aug 23, 2025 / Update 13"],
  "Galactic": ["reported","La Vacca Saturno Saturnita Ritual – Aug 23, 2025 / Update 13"],
  "Explosive": ["reported","Bombardiro Crocodilo Ritual – Aug 23, 2025 / Update 13"],
  "Shark Fin": ["reported","Orcalero Orcala Ritual – Aug 23, 2025 / Update 13"],
  "Job Application": ["reported","Job Job Job Sahur Ritual – Aug 1, 2026 / Update 60"],
  "Money": ["reported","Money Puggy Ritual – Sept 5, 2026 / Update 65"],
  "Rainbow Balloon": ["reported","All released March 21, 2026 – Update 43"],
  "Pink Balloon": ["reported","All released March 21, 2026 – Update 43"],
  "Red Balloon": ["reported","All released March 21, 2026 – Update 43"],
  "Blue Balloon": ["reported","All released March 21, 2026 – Update 43"],
  "Green Balloon": ["reported","All released March 21, 2026 – Update 43"],
  "Orange Balloon": ["reported","All released March 21, 2026 – Update 43"],
  "Pink Egg": ["reported","Released March 28 – April 4, 2026 – Updates 44–45"],
  "Blue Egg": ["reported","Released March 28 – April 4, 2026 – Updates 44–45"],
  "Bunny Ears": ["reported","Released March 28 – April 4, 2026 – Updates 44–45"],
  "Green Egg": ["reported","Released March 28 – April 4, 2026 – Updates 44–45"],
  "Orange Egg": ["reported","Released March 28 – April 4, 2026 – Updates 44–45"],
  "Lucky": ["reported","St. Patrick's Day – Mar 14, 2026 / Update 42"],
  "Sun": ["reported","Summer Hour – June 13, 2026 / Update 53"],
  "Ball": ["reported","Live Match Events – June 27, 2026 / Update 55"],
  "Chocolate": ["reported","Valentine's Day – Feb 7, 2026 / Update 37"],
  "Skeleton": ["reported","Extinct Event – Sept 13, 2025 / Update 16"],
  "Jack O' Lantern Pet": ["reported","Released Oct 25, 2025 – Update 22"],
  "RIP Gravestone": ["reported","Released Oct 25, 2025 – Update 22"],
  "Witch Hat": ["documented","2025-10-11"],
  "Bat": ["reported","Trick or Treat – Oct 31, 2026 / Update 73"],
  "Bee": ["reported","All released August 8–29, 2026 – Updates 61–64"],
  "Fire Bee": ["reported","All released August 8–29, 2026 – Updates 61–64"],
  "Ice Bee": ["reported","All released August 8–29, 2026 – Updates 61–64"],
  "Queen Bee": ["reported","All released August 8–29, 2026 – Updates 61–64"],
  "1 Year": ["reported","1 Year Anniversary – May 16, 2026 / Update 51"],
  "10B": ["reported","10 Billion Visits – Nov 15, 2025 / Update 25"],
  "Comet-struck": ["reported","Launched starting June 28, 2025 – Update 5"],
  "Snowy": ["reported","Launched starting June 28, 2025 – Update 5"],
  "Wet": ["reported","Launched starting June 28, 2025 – Update 5"],
  "Reindeer Pet": ["reported","Released Dec 13–20, 2025 – Updates 29–30"],
  "Santa Hat": ["reported","Released Dec 6, 2025 – Update 28"],
  "Halo": ["documented","2026-02-21"],
  "Brazil": ["reported","Brazil Event – Aug 15, 2025 / Update 12"],
  "Indonesian": ["reported","Indonesia Event – Oct 18, 2025 / Update 21"],
  "Sombrero": ["reported","Mexico Event – Sept 20, 2025 / Update 17"],
  "Algeria": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Argentina": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Australia": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Austria": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Belgium": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Bosnia and Herzegovina": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Canada": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Cape Verde": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Colombia": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Croatia": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Curacao": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Czechia": ["event date","2026-06-27 (Update 55, Futbol)"],
  "DR Congo": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Ecuador": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Egypt": ["event date","2026-06-27 (Update 55, Futbol)"],
  "England": ["event date","2026-06-27 (Update 55, Futbol)"],
  "France": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Germany": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Ghana": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Haiti": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Iran": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Iraq": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Ivory Coast": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Japan": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Jordan": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Mexico": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Morocco": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Netherlands": ["event date","2026-06-27 (Update 55, Futbol)"],
  "New Zealand": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Norway": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Panama": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Paraguay": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Portugal": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Qatar": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Saudi Arabia": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Scotland": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Senegal": ["event date","2026-06-27 (Update 55, Futbol)"],
  "South Africa": ["event date","2026-06-27 (Update 55, Futbol)"],
  "South Korea": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Spain": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Sweden": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Switzerland": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Tunisia": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Turkey": ["event date","2026-06-27 (Update 55, Futbol)"],
  "United States": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Uruguay": ["event date","2026-06-27 (Update 55, Futbol)"],
  "Uzbekistan": ["event date","2026-06-27 (Update 55, Futbol)"]
};

const STORED_AI_PROMPT = `You are TRACED RIDDLER, a deterministic solver for Steal a Brainrot (SAB) riddles and code clues.

PRIMARY GOAL
Return the exact answer fragment the game expects. Do not chat. Do not explain reasoning.

SOURCE PRIORITY
1. Rules and authoritative hardcoded game facts in this prompt.
2. RECENT CLIENT DATA supplied with the request. Treat live Animals/Traits/Mutations context from the client as newer than stored Info Book data.
3. The supplied SAB Info Book.
4. Obvious real-world/common-knowledge facts only when the clue is not SAB-specific.
Never invent an SAB-specific fact that is not supported by these sources.

INTERPRETATION
- Treat spelling, capitalization, punctuation, apostrophes, minor grammar mistakes, singular/plural forms, aliases, abbreviations, and partial canonical names flexibly.
- In Sammy/Eternal riddles, "my", "me", "I", "his", and "Sammy" refer to Sammy when context makes that clear.
- Prefer canonical Brainrot, mutation, rarity, trait, update, event, machine, and item names from the Info Book.
- A standalone number is literal. Never turn a bare number into a riddle. Preserve its digits exactly.
- If asked for a name, return the name only. If asked for a count/number, return the number only. If asked for a mutation, return the mutation only.
- For base income per second, use compact lowercase suffixes k, m, b, or t and preserve significant decimals, such as 425m or 545.5m.
- "best", "highest", "most", "strongest" means the highest applicable numeric value unless the Info Book explicitly defines otherwise.
- "worst", "lowest", "least", "weakest", "rarest" means the lowest applicable numeric value/count unless wording or the Info Book says otherwise.
- For exist counts, use live/current count data when supplied and never fabricate a missing count.

OUTPUT CONTRACT
- Output ONLY the requested answer value or fragment.
- No explanations, markdown, labels, quotes, prefixes, suffixes, or commentary.
- Never write "Answer:", "Code:", "The answer is", or similar text.
- Use the exact delimiter requested by an outer multipart instruction.
- Do not add a delimiter to a single-part answer.

MULTIPART / CODE RIDDLES
- Solve each clue independently in the original order.
- Do not let one clue alter another clue's meaning.
- Bare numeric pieces remain unchanged.
- When the pieces form a code, concatenate final fragments in clue order with no spaces or punctuation unless the caller explicitly asks for a delimiter.
- Example: "favorite color, my cat, 67" => bluenova67
- Example: "the color of grass, the color of tree bark, the color of sand, 67" => greenbrownyellow67
- If the outer instruction requires ||| between fragments, return the independent fragments with exactly ||| instead of concatenating them.

WORD-ORDER RULES
- "spell X backwards" or a single answer "backwards" means reverse characters.
- "backwards order" or "reverse the order" for a list means reverse list elements, not letters inside the elements.

UPDATE / EVENT RULES
- When asked which update/event/theme something released in, return the update/event/theme NAME if the question asks for the name.
- Return an Update number only when the question explicitly asks for the number.
- Pot Pumpkin release theme/name => Halloween.
- Treat reported trait dates and event dates as approximate context. Give an exact trait debut only when documented. Money is a reported trait name with an unpublished multiplier. 1x1x1x1 is the ritual and its Brainrot reward. Glitched is the associated trait.

SAMMY / ETERNAL HARD FACTS
- Name: Sammy
- Favorite Brainrot: Meowl
- Least Favorite Brainrot: Raccooni Jandelini
- Favorite color: Blue
- Favorite Travis Scott album: Astro World
- Birth month: February
- Age: 24
- Weight: 250
- Place after Admin Abuse: Gym
- Cat name: Nova
- Favorite mutation: Yin Yang
- Anti-cheat developer name: Adam

KNOWN SAB RIDDLE FACTS
- Hacker is scheduled for Saturday, November 21, 2026. Its multiplier and mechanics are unconfirmed. Through November 20, 2026 Central time, Hacker is the answer to the next upcoming mutation clue. Starting November 21, do not treat this schedule as the next mutation.
- Scarino Crowino is a reskin of Fishino Clownino. SAB released on May 15.
- The Brainrot associated with John Pork is Tim Cheese. For the paired earnings clue, the expected number is 5.
- Scorpi is the second scorpion Brainrot. The first was obtained from the RNG Machine.
- Sammyni Spyderini was previously called Chimpanzini Spiderini.
- The Halloween event that gave Brainrots purple hats was Witching Hour.
- The rarest DLC Brainrot from the first minifigure release was Pancake and Syrup.
- The trick-or-treating event Brainrot was Noomy Candy.
- When Sammy skips tacos on Tuesday, the singular answer is enchilada.
- Pum Pum Pum is a reskin of Dug Dug Dug. Halloween is October 31.
- Past event riddles used Eclipse for the new mutation, Phoenix for the best Fuse Brainrot, and Griffin for the strongest Series 2 minifigure. For current questions, use newer supplied game data when available.

COMMON OBJECT COLORS
- grass/leaves/tree/frog => green
- sky/ocean/sea/water => blue
- sun/banana/lemon/cheese/sand => yellow
- snow/cloud/milk/paper => white
- blood/fire/tomato/strawberry/apple/rose => red
- night/coal => black
- orange/carrot/pumpkin => orange
- chocolate/dirt/mud/wood/tree bark => brown
- pig/flamingo => pink
- grape/lavender => purple

MUTATION MODIFIERS — AUTHORITATIVE LAST-WORKING GAME DATA
- Gold 0.25
- Diamond 0.5
- Bloodrot 1
- Candy 3
- Lava 5
- Galaxy 6
- Yin Yang 6.5
- Radioactive 7.5
- Cursed 8
- Rainbow 9
- Divine 9
- Cyber 10
- Phantom 11
- Crystal 12
- Eclipse 12.5
Use these raw values for explicit game-data Modifier questions and tracked 1/1 comparisons. The wiki multiplier is the displayed value and can differ from the raw game field. Prefer live client data when it explicitly supplies the requested field.

BASE SKINS — LAST-WORKING DATA
1 OF 1
Bee Emperor
Bunny Basket
Headless
Honey Bee
John Pork
Meowl
Pot of Gold
Skibidi
Spyder
Strawberry

RANKED 1/1 RULE
For "best/highest 1/1 mutation", compare only that Brainrot's tracked 1/1 mutations and return the highest Modifier mutation from the authoritative mutation table above. For "worst/lowest", return the lowest Modifier mutation. Return only the mutation name.

DATE RULES
A CURRENT DATE CONTEXT is supplied by the Worker. Use it for "today", "current date", "date/day of the month", current month/year, and weekday-relative questions. For date/day of the month, return only the numeric day.

FINAL CHECK
Before answering: use the Info Book instead of guessing SAB facts; preserve literal numbers; preserve multipart order; return only the exact requested value.`;

// Keep the full prompt readable in source. Select optional sections once per request.
const promptSections = STORED_AI_PROMPT.split(/\n\n(?=[A-Z][A-Z /0-9—-]+\n)/);
const optionalPromptSections = new Map([
  ["MULTIPART / CODE RIDDLES", /\b(code|concatenate|fragment|combine|join|plus|delimiter)\b/],
  ["WORD-ORDER RULES", /\b(reverse|backwards|backward|reversed)\b/],
  ["UPDATE / EVENT RULES", /\b(update|event|theme|release|released|launch|introduced|added|pot pumpkin)\b/],
  ["SAMMY / ETERNAL HARD FACTS", /\b(sammy|eternal|my|me|i|his|favorite|favourite|least favorite|admin abuse|anti cheat|anticheat)\b/],
  ["KNOWN SAB RIDDLE FACTS", /\b(brainrot|reskin|scarino|fishino|john pork|tim cheese|scorpi|scorpion|sammyni|spyderini|halloween|witching|dlc|minifigures?|toys?|tacos?|enchiladas?|dug dug dug|fuse|new mutation|next mutation|hacker|eclipse|phoenix|griffin|sab|steal a brainrot|released?|trick or treating)\b/],
  ["COMMON OBJECT COLORS", /\b(color|colour|colored|coloured|shade)\b/],
  ["MUTATION MODIFIERS — AUTHORITATIVE LAST-WORKING GAME DATA", /\b(mutations?|modifier|multiplier|multiplies|gold|diamond|bloodrot|candy|lava|galaxy|yin yang|yinyang|radioactive|cursed|rainbow|divine|cyber|phantom|crystal|eclipse)\b|1\s*(?:\/|of)\s*1\b/],
  ["BASE SKINS — LAST-WORKING DATA", /\b(base|skins?|one of one)\b|1\s*(?:\/|of)\s*1\b/],
  ["RANKED 1/1 RULE", /\bone of one\b|1\s*(?:\/|of)\s*1\b/],
  ["DATE RULES", /\b(today|tomorrow|yesterday|date|day|month|year|weekday|monday|tuesday|wednesday|thursday|friday|saturday|sunday|current|recent|now|ago|next|last)\b/],
]);

function buildPromptContext(clues, {multipart=false, recentContext="", infoContext=""} = {}) {
  const question = clues.toLowerCase().replace(/[^a-z0-9/]+/g, " ");
  const selected = promptSections.filter(section => {
    const heading = section.split("\n", 1)[0];
    const trigger = optionalPromptSections.get(heading);
    return !trigger || trigger.test(question) || (multipart && heading === "MULTIPART / CODE RIDDLES");
  });
  if (optionalPromptSections.get("DATE RULES").test(question)) {
    selected.push("=== CURRENT DATE CONTEXT ===\n" + currentPromptContext());
  }
  if (/\bmutations?\b/.test(question)) {
    selected.push("=== WIKI MUTATION DATA ===\nName | displayed multiplier | release date\n" +
      WIKI_MUTATIONS.map(([name, value, date]) => name + " | " + value + "x | " + (date || "—")).join("\n"));
  }
  if (/\btraits?\b/.test(question)) {
    const wantsDates = /\b(when|release|released|introduced|added|debut|date|month|year|first appeared)\b/.test(question);
    const mentioned = WIKI_TRAITS.filter(([name]) => {
      const key = normalizeDirect(name);
      return key && (" " + normalizeDirect(clues) + " ").includes(" " + key + " ");
    });
    const rows = wantsDates && mentioned.length ? mentioned : WIKI_TRAITS;
    selected.push("=== WIKI TRAIT DATA ===\nName | multiplier" + (wantsDates ? " | release evidence" : "") + "\n" +
      rows.map(([name, value]) => {
        const release = TRAIT_RELEASES[name];
        return name + " | " + (value == null ? "unpublished" : value + "x")
          + (wantsDates ? " | " + (release ? release.join(": ") : "unknown") : "");
      }).join("\n"));
  }
  if (/\bogs?\b/.test(question)) {
    selected.push("=== RELEASED OG BRAINROTS ===\nRelease order: " + OG_RELEASE_ORDER.join(", ") +
      "\nBase income ranking, highest first: " + OG_INCOME_ORDER.join(", ") +
      "\nBase prices: " + OG_PRICE_ORDER.map(name => name + " " + formatBrainrotIncome(OG_PRICES[name])).join(", ") +
      "\nOG rarity debuted in Update 14 on August 30, 2025. Interpret bare ordinals as release order, best and worst as base income, and cheapest and most expensive as purchase price. Ignore unreleased entries.");
  }
  const paddedClues = " " + brainrotKey(clues) + " ";
  const matchingFacts = BRAINROT_REFERENCE.filter(({name}) =>
    paddedClues.includes(" " + brainrotKey(name) + " "));
  if (matchingFacts.length) {
    selected.push("=== MATCHING BRAINROT RECORDS ===\n" + matchingFacts.slice(0, 20).flatMap(brainrotCard).join("\n"));
  }
  for (const [topic, section] of Object.entries(REFERENCE_SECTIONS)) {
    const terms = topic.replaceAll("-", " ");
    if (paddedClues.includes(" " + terms + " ") || paddedClues.includes(" " + terms.replace(/s$/, "") + " ")) {
      selected.push(selectInfoBookContext(clues, section, 3000));
    }
  }
  if (recentContext) selected.push("=== RECENT SAMMY CONTEXT ===\n" + recentContext);
  if (infoContext) selected.push("=== RELEVANT SAB INFO BOOK ===\n" + infoContext);
  return selected.join("\n\n");
}


const json = (data, status=200) => Response.json({...data, workerVersion:WORKER_CACHE_VERSION}, {
  status,
  headers: {
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type,x-riddler-token",
    "access-control-allow-methods": "POST,OPTIONS"
  }
});

const normalizeDirect = value => String(value || "")
  .toLowerCase()
  .replace(/<[^>]*>/g, " ")
  .replace(/[’']/g, "'")
  .replace(/[^a-z0-9']+/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const directAnswers = new Map([
  ["my name","sammy"],
  ["what is my name","sammy"],
  ["whats my name","sammy"],
  ["what's my name","sammy"],
  ["sammy name","sammy"],
  ["the color of my avatar","red"],
  ["the colour of my avatar","red"],
  ["my avatar color","red"],
  ["my avatar colour","red"],
  ["my cats name","nova"],
  ["my cat name","nova"],
  ["my cat's name","nova"],
  ["name of my cat","nova"],
  ["my favorite brainrot","meowl"],
  ["my favourite brainrot","meowl"],
  ["favorite brainrot","meowl"],
  ["favourite brainrot","meowl"],
  ["my least favorite brainrot","raccooni jandelini"],
  ["my least favourite brainrot","raccooni jandelini"],
  ["my favorite color","blue"],
  ["my favourite colour","blue"],
  ["my favorite mutation","yin yang"],
  ["my favourite mutation","yin yang"],
  ["my birth month","february"],
  ["my birthday month","february"],
  ["my age","24"],
  ["my weight","250"],
  ["the color of grass","green"],
  ["the color of the grass","green"],
  ["what color is grass","green"],
  ["what colour is grass","green"],
  ["grass color","green"],
  ["grass colour","green"],

  ["the color of tree bark","brown"],
  ["the color of the tree bark","brown"],
  ["the colour of tree bark","brown"],
  ["the colour of the tree bark","brown"],
  ["what color is tree bark","brown"],
  ["what colour is tree bark","brown"],
  ["tree bark color","brown"],
  ["tree bark colour","brown"],
  ["bark color","brown"],
  ["bark colour","brown"],

  ["the color of sand","yellow"],
  ["the color of the sand","yellow"],
  ["the colour of sand","yellow"],
  ["the colour of the sand","yellow"],
  ["what color is sand","yellow"],
  ["what colour is sand","yellow"],
  ["sand color","yellow"],
  ["sand colour","yellow"]
]);

// Keep these patterns specific to the known clues so nearby questions can use the Info Book.
const knownRiddleAnswers = [
  [/\bscarino crowino\b.*\breskin of\b/, "fishino clownino"],
  [/\b(?:day|date) in may\b.*\b(?:sab|steal a brainrot)\b.*\breleas/, "15"],
  [/\bbrainrot\b.*\bassociated with john pork\b/, "timcheese"],
  [/\bscorpi\b.*\bfirst one (?:obtained|acquired)\b/, "rngmachine"],
  [/\bsammyni spyderini\b.*\b(?:called before|previously called|old name)\b/, "chimpanzini spiderini"],
  [/\bhalloween event\b.*\bpurple hats?\b/, "witchinghour"],
  [/\brarest dlc brainrot\b.*\bfirst minifigures\b/, "pancakeandsyrup"],
  [/\bbrainrot\b.*\btrick or treating event\b/, "noomycandy"],
  [/\bmedusa\b.*\bon her head\b/, "snakes"],
  [/\btacos for tuesday\b.*\busually get\b/, "enchilada"],
  [/\breskin of dug dug dug\b/, "pumpumpum"],
  [/^(?:and )?what (?:day|date) is halloween$/, "31"]
];

const eventRiddleAnswers = new Map([
  ["todays new mutation", "eclipse"],
  ["today's new mutation", "eclipse"],
  ["best brainrot in the fuse", "phoenix"],
  ["what is the most op minifigure toy in the new series 2 minifigures", "griffin"]
]);

const NUMBER_ONLY = /^-?\d+(?:\.\d+)?%?$/;

const CAPITALS = new Map([
  ["france","paris"],["italy","rome"],["germany","berlin"],["spain","madrid"],
  ["portugal","lisbon"],["japan","tokyo"],["china","beijing"],["india","newdelhi"],
  ["canada","ottawa"],["mexico","mexicocity"],["brazil","brasilia"],["australia","canberra"],
  ["russia","moscow"],["egypt","cairo"],["england","london"],["britain","london"],
  ["united kingdom","london"],["south korea","seoul"],["north korea","pyongyang"],
  ["argentina","buenosaires"],["sweden","stockholm"],["norway","oslo"],["finland","helsinki"],
  ["denmark","copenhagen"],["ireland","dublin"],["greece","athens"],["turkey","ankara"],
  ["thailand","bangkok"],["vietnam","hanoi"],["philippines","manila"],["indonesia","jakarta"],
  ["singapore","singapore"],["switzerland","bern"],["austria","vienna"],["belgium","brussels"],
  ["netherlands","amsterdam"],["poland","warsaw"],["ukraine","kyiv"],["romania","bucharest"],
  ["hungary","budapest"],["czechia","prague"],["czech republic","prague"],["iceland","reykjavik"],
  ["cuba","havana"],["peru","lima"],["chile","santiago"],["colombia","bogota"],
  ["venezuela","caracas"],["morocco","rabat"],["kenya","nairobi"],["nigeria","abuja"],
  ["ethiopia","addisababa"],["new zealand","wellington"],["united states","washingtondc"],
  ["usa","washingtondc"],["america","washingtondc"]
]);

const CAPITAL_CITY_SELF = new Map([
  ["paris","paris"],["rome","rome"],["berlin","berlin"],["madrid","madrid"],["lisbon","lisbon"],
  ["tokyo","tokyo"],["beijing","beijing"],["ottawa","ottawa"],["brasilia","brasilia"],
  ["canberra","canberra"],["moscow","moscow"],["cairo","cairo"],["london","london"],
  ["seoul","seoul"],["oslo","oslo"],["helsinki","helsinki"],["copenhagen","copenhagen"],
  ["dublin","dublin"],["athens","athens"],["ankara","ankara"],["bangkok","bangkok"],
  ["hanoi","hanoi"],["manila","manila"],["jakarta","jakarta"],["bern","bern"],
  ["vienna","vienna"],["brussels","brussels"],["amsterdam","amsterdam"],["warsaw","warsaw"],
  ["kyiv","kyiv"],["prague","prague"],["reykjavik","reykjavik"],["havana","havana"],
  ["lima","lima"],["santiago","santiago"],["bogota","bogota"],["caracas","caracas"],
  ["rabat","rabat"],["nairobi","nairobi"],["abuja","abuja"],["wellington","wellington"]
]);

function directGenericAnswer(question) {
  const q = normalizeDirect(question);

  const literalWord =
    q.match(/^the word ([a-z0-9]+)$/) ||
    q.match(/^word ([a-z0-9]+)$/) ||
    q.match(/^the literal word ([a-z0-9]+)$/);
  if (literalWord) return literalWord[1];

  // Flexible Sammy/persona phrasing should never need an upstream AI call.
  if (q.includes("least favorite brainrot") || q.includes("least favourite brainrot")) {
    return "raccooni jandelini";
  }
  if (q.includes("favorite brainrot") || q.includes("favourite brainrot")) {
    return "meowl";
  }
  if (q.includes("favorite color") || q.includes("favourite colour")) {
    return "blue";
  }
  if (q.includes("favorite mutation") || q.includes("favourite mutation")) {
    return "yin yang";
  }
  if (q.includes("cat") && q.includes("name")) return "nova";
  if (q.includes("birth") && q.includes("month")) return "february";
  if (q.includes("travis") && q.includes("album")) return "astro world";
  if ((q.includes("my age") || q.includes("sammy age") || q.includes("how old is sammy") || q === "how old am i")) return "24";
  if ((q.includes("my weight") || q.includes("sammy weight") || q.includes("how much does sammy weigh"))) return "250";

  for (const [pattern, answer] of knownRiddleAnswers) {
    if (pattern.test(q)) return answer;
  }

  if (q.includes("capital")) {
    for (const [country, capital] of CAPITALS) {
      if (q.includes(country)) return capital;
    }
    for (const [city, answer] of CAPITAL_CITY_SELF) {
      if (q.includes(city)) return answer;
    }
  }

  return null;
}

function formatBrainrotIncome(value) {
  for (const [unit, suffix, digits] of [[1e12,"t",12],[1e9,"b",9],[1e6,"m",6],[1e3,"k",3]]) {
    if (value < unit) continue;
    const remainder = String(value % unit).padStart(digits,"0").replace(/0+$/, "");
    return Math.floor(value / unit) + (remainder ? "." + remainder : "") + suffix;
  }
  return String(value);
}

// Released OG roster and base incomes: https://stealabrainrot.wiki/wiki/rarities/
const OG_RELEASE_ORDER = ["Strawberry Elephant","Meowl","Headless Horseman","Skibidi Toilet","John Pork","Spyder Elephant"];
const OG_INCOME_ORDER = ["Spyder Elephant","Strawberry Elephant","Headless Horseman","Meowl","John Pork","Skibidi Toilet"];

// Catalog prices, separate from income or trading values.
const OG_PRICES = {"Strawberry Elephant":750000000000,"Meowl":650000000000,"Headless Horseman":600000000000,"Skibidi Toilet":450000000000,"John Pork":500000000000,"Spyder Elephant":1000000000000};
const OG_PRICE_ORDER = Object.keys(OG_PRICES).sort((a,b) => OG_PRICES[b] - OG_PRICES[a]);

function ogBrainrotAnswer(question) {
  const q = normalizeDirect(question)
    .replace(/^(?:(?:what|which)(?: is| was| are)?|what's|whats|name) /, "")
    .replace(/^the /, "")
    .replace(/ (?:added to|released in|in) (?:the game|sab|steal a brainrot)$/, "")
    .replace(/ (?:ever )?(?:added|released)$/, "")
    .replace(/\bog rarity\b/, "og")
    .replace(/^(og(?: brainrot)?) (?:was )?(?:added|released|came) (first|second|third|fourth|fifth|sixth|[1-6](?:st|nd|rd|th))$/, "$2 $1");
  const lookup = name => OG_RELEASE_ORDER.find(label => normalizeDirect(label) === name.replace(/^the /, ""));
  const joinNames = names => names.join("").replace(/[^a-z0-9]/gi, "").toLowerCase();
  if (/^(?:when (?:did|was) )?og rarity (?:come out|released|added|introduced)$/.test(normalizeDirect(question).replace(/^when (did|was) the /, "when $1 "))) return "august 30 2025";
  if (/^(?:what|which) update (?:introduced|added) (?:the )?og rarity$/.test(normalizeDirect(question))) return "14";
  const price = q.match(/^(?:(?:base )?(?:price|cost) (?:of|for) (.+)|how much does (.+) cost)$/);
  if (price) {
    const name = lookup(price[1] || price[2]);
    if (name) return formatBrainrotIncome(OG_PRICES[name]);
  }
  const priceRank = q.match(/^(most expensive|cheapest|least expensive) og(?: brainrot)?$/);
  if (priceRank) return priceRank[1] === "most expensive" ? OG_PRICE_ORDER[0] : OG_PRICE_ORDER.at(-1);
  const incomeList = q.match(/^(?:(?:list|rank|sort|name) )?(?:all )?ogs?(?: brainrots?)? (?:by (?:base )?income|from (?:strongest to weakest|weakest to strongest|best to worst|worst to best))(?: (lowest first|highest first))?$/);
  if (incomeList) return joinNames(/weakest to strongest|worst to best|lowest first/.test(q) ? [...OG_INCOME_ORDER].reverse() : OG_INCOME_ORDER);
  const relative = q.match(/^(?:(how many) )?(?:(?:which|what) )?ogs?(?: brainrots?)? (?:came|released|were added) (before|after) (.+)$/);
  if (relative) {
    const name = lookup(relative[3]);
    if (name) {
      const index = OG_RELEASE_ORDER.indexOf(name);
      const list = relative[2] === "before" ? OG_RELEASE_ORDER.slice(0,index) : OG_RELEASE_ORDER.slice(index+1);
      return relative[1] ? String(list.length) : (list.length ? joinNames(list) : "none");
    }
  }
  if (/^(?:how many (?:released )?ogs?(?: brainrots?)?(?: are there| exist)?|number of (?:released )?ogs?(?: brainrots?)?)$/.test(q)) return String(OG_RELEASE_ORDER.length);
  if (/^(?:list |name |all )?(?:all |the )?(?:released )?ogs?(?: brainrots?)?(?: in (?:release|chronological) order| from oldest to newest)?$/.test(q)) {
    return OG_RELEASE_ORDER.join("").replace(/[^a-z0-9]/gi, "").toLowerCase();
  }
  const releaseRank = q.match(/^(?:release (?:rank|position) of |number og was |release rank was )(.+)$/);
  if (releaseRank) {
    const name = lookup(releaseRank[1]);
    if (name) return String(OG_RELEASE_ORDER.indexOf(name) + 1);
  }
  const comparison = q.match(/^(?:makes|earns|generates) (more|less)(?: per second)? (.+) or (.+)$/)
    || q.match(/^(more|less) income (.+) or (.+)$/);
  if (comparison) {
    const left = lookup(comparison[2]), right = lookup(comparison[3]);
    if (left && right) {
      const leftIncome = BRAINROT_CATALOG.find(([name]) => name === left)?.[1];
      const rightIncome = BRAINROT_CATALOG.find(([name]) => name === right)?.[1];
      if (leftIncome != null && leftIncome === rightIncome) return "same";
      const leftHigher = OG_INCOME_ORDER.indexOf(left) < OG_INCOME_ORDER.indexOf(right);
      return leftHigher === (comparison[1] === "more") ? left : right;
    }
  }
  const list = q.match(/^(?:(top|bottom) )?(\d+|one|two|three|four|five|six)(?: (best|strongest|worst|weakest))? ogs?(?: brainrots?)?$/);
  if (list && (list[1] || list[3])) {
    const count = Number(list[2]) || ["one","two","three","four","five","six"].indexOf(list[2]) + 1;
    if (count < 1 || count > OG_INCOME_ORDER.length) return null;
    const lowest = list[1] === "bottom" || /worst|weakest/.test(list[3] || "");
    const ranked = lowest ? [...OG_INCOME_ORDER].reverse() : OG_INCOME_ORDER;
    return ranked.slice(0,count).join("").replace(/[^a-z0-9]/gi, "").toLowerCase();
  }
  const releaseOrdinal = q.match(/^(first|second|third|fourth|fifth|sixth|1st|2nd|3rd|4th|5th|6th)(?: ever| added| released)? og(?: brainrot)?$/);
  if (releaseOrdinal) {
    const ordinal = releaseOrdinal[1];
    const index = /^\d/.test(ordinal) ? Number(ordinal[0])-1
      : ["first","second","third","fourth","fifth","sixth"].indexOf(ordinal);
    return OG_RELEASE_ORDER[index] || null;
  }
  const match = q.match(/^(?:(2nd|3rd|4th|5th|6th|second|third|fourth|fifth|sixth) )?(first(?: ever| added| released)?|oldest|earliest|latest|newest|last|best|strongest|highest income|worst|weakest|lowest income) og(?: brainrot)?$/);
  if (!match) return null;
  const rank = ["second","third","fourth","fifth","sixth"].indexOf(match[1]) + 2;
  const index = match[1] && /^\d/.test(match[1]) ? Number(match[1][0]) - 1 : rank - 1;
  const kind = match[2];
  if (/^(?:first|oldest|earliest)/.test(kind)) return OG_RELEASE_ORDER[index] || null;
  if (/^(?:latest|newest|last)$/.test(kind)) return OG_RELEASE_ORDER.at(-1-index) || null;
  return (/worst|weakest|lowest/.test(kind) ? OG_INCOME_ORDER.at(-1-index) : OG_INCOME_ORDER[index]) || null;
}

// Acquisition sources from the supplied Animals ObtainedFrom entries.
// A listed source can be historical. It does not establish current availability.
const BRAINROT_OBTAIN_SOURCES = new Map([
  ["noobini pizzanini","The Red Carpet"],
  ["liril laril","The Red Carpet"],
  ["tim cheese","The Red Carpet"],
  ["fluriflura","The Red Carpet"],
  ["svinina bombardino","The Red Carpet"],
  ["talpa di fero","The Red Carpet"],
  ["pipi kiwi","The Red Carpet"],
  ["pipi corni","Summer Fuse"],
  ["raccooni jandelini","Admin Abuse War"],
  ["tartaragno","Haunted Fuse"],
  ["noobini santanini","Santa's Fuse"],
  ["holy arepa","Divine Fuse"],
  ["trippi troppi","The Red Carpet"],
  ["gangster footera","The Red Carpet"],
  ["boneca ambalabu","The Red Carpet"],
  ["ta ta ta ta sahur","The Red Carpet"],
  ["tric trac baraboom","The Red Carpet"],
  ["bandito bobritto","The Red Carpet"],
  ["cacto hipopotamo","The Red Carpet"],
  ["pipi avocado","Summer Fuse"],
  ["pinealotto fruttarino","Haunted Fuse"],
  ["cupcake koala","Brainrot Trader"],
  ["frogo elfo","Santa's Fuse"],
  ["pengolino nuvoletto","Divine Fuse"],
  ["cappuccino assassino","The Red Carpet"],
  ["brr brr patapim","The Red Carpet"],
  ["trulimero trulicina","The Red Carpet"],
  ["bananita dolphinita","The Red Carpet"],
  ["brri brri bicus dicus bombicus","The Red Carpet"],
  ["bambini crostini","The Red Carpet"],
  ["perochello lemonchello","The Red Carpet"],
  ["avocadini guffo","The Red Carpet"],
  ["salamino penguino","The Red Carpet"],
  ["ti ti ti sahur","Summer Fuse"],
  ["penguino cocosino","Summer Fuse"],
  ["avocadini antilopini","The Red Carpet"],
  ["malame amarele","First Craft Machine"],
  ["mangolini parrocini","Brainrot Trader"],
  ["mummio rappitto","Haunted Fuse"],
  ["frogato pirato","Witch's Fuse"],
  ["wombo rollo","The Red Carpet"],
  ["doi doi do","Brainrot Trader"],
  ["penguin tree","Santa's Fuse"],
  ["gato celesto","Divine Fuse"],
  ["burbaloni loliloli","The Red Carpet"],
  ["chimpanzini bananini","The Red Carpet"],
  ["ballerina cappuccina","The Red Carpet"],
  ["chef crabracadabra","The Red Carpet"],
  ["glorbo fruttodrillo","The Red Carpet"],
  ["blueberrinni octopusini","The Red Carpet"],
  ["lionel cactuseli","The Red Carpet"],
  ["pandaccini bananini","The Red Carpet"],
  ["strawberrelli flamingelli","The Red Carpet"],
  ["cocosini mama","First Fuse Machine"],
  ["pi pi watermelon","Summer Fuse"],
  ["sigma boy","The Red Carpet"],
  ["pipi potato","The Red Carpet"],
  ["quivioli ameleonni","The Red Carpet"],
  ["caramello filtrello","First Craft Machine"],
  ["sigma girl","First Craft Machine"],
  ["quackula","Haunted Fuse"],
  ["buho de fuego","Haunted Fuse"],
  ["clickerino crabo","Brainrot Trader"],
  ["puffaball","Fishing Event"],
  ["chocco bunny","Santa's Fuse"],
  ["sealo regalo","Santa's Fuse"],
  ["buho del cielo","Divine Fuse"],
  ["seraphino gruyero","Divine Fuse"],
  ["bandito axolito","Cyber Craft"],
  ["electro quacko","Cyber Craft"],
  ["frigo camelo","The Red Carpet"],
  ["orangutini ananassini","The Red Carpet"],
  ["bombardiro crocodilo","The Red Carpet"],
  ["bombombini gusini","The Red Carpet"],
  ["rhino toasterino","The Red Carpet"],
  ["cavallo virtuoso","The Red Carpet"],
  ["gorillo watermelondrillo","The Red Carpet"],
  ["avocadorilla","First Fuse Machine"],
  ["ganganzelli trulala","First Fuse Machine"],
  ["tob tobi tobi","First Fuse Machine"],
  ["te te te sahur","The Red Carpet"],
  ["tracoducotulu delapeladustuz","The Red Carpet"],
  ["lerulerulerule","The Red Carpet"],
  ["brutto gialutto","First Craft Machine"],
  ["gorillo subwoofero","First Craft Machine"],
  ["los noobinis","Cyber Craft"],
  ["rhino helicopterino","First Craft Machine"],
  ["toiletto focaccino","The Red Carpet"],
  ["cachorrito melonito","The Red Carpet"],
  ["magi ribbitini","Haunted Fuse"],
  ["jacko spaventosa","Witch's Fuse"],
  ["stoppo luminino","Brainrot Trader"],
  ["centrucci nuclucci","Brainrot Trader"],
  ["jingle jingle sahur","Santa's Fuse"],
  ["tree tree tree sahur","Santa's Fuse"],
  ["spongini quackini","OG Fuse"],
  ["fizzy soda","OG Fuse"],
  ["harpuccino","Divine Fuse"],
  ["berenjello angello","Divine Fuse"],
  ["bee loco","Cyber Craft"],
  ["orbi mochi","Cyber Craft"],
  ["cocoteddy","Summer Fuse"],
  ["bucketoro","Summer Fuse"],
  ["cocofanto elefanto","The Red Carpet"],
  ["tralalero tralala","The Red Carpet"],
  ["odin din din dun","The Red Carpet"],
  ["girafa celestre","The Red Carpet"],
  ["trenostruzzo turbo 3000","The Red Carpet"],
  ["matteo","Admin Abuse"],
  ["unclito samito","Admin Abuse"],
  ["gattatino nyanino","Admin Abuse"],
  ["espresso signora","Admin Abuse"],
  ["ballerino lololo","The Red Carpet"],
  ["piccione macchina","The Red Carpet"],
  ["los crocodillitos","Bombardiro Event"],
  ["tukanno bananno","First Fuse Machine"],
  ["trippi troppi troppa trippa","The Red Carpet"],
  ["los tungtungtungcitos","First Fuse Machine"],
  ["los orcalitos","First Fuse Machine"],
  ["tipi topi taco","Taco Event"],
  ["bombardini tortinii","Taco Event"],
  ["tralalita tralala","The Red Carpet"],
  ["urubini flamenguini","Admin Abuse"],
  ["pakrahmatmamat","The Red Carpet"],
  ["brr es teh patipum","First Fuse Machine"],
  ["tartaruga cisterna","This is obtained from Sammy's Base"],
  ["cacasito satalito","The Red Carpet"],
  ["las capuchinas","First Craft Machine"],
  ["orcalita orcala","Cyber Craft"],
  ["piccionetta macchina","First Craft Machine"],
  ["anpali babel","This was obtained from the Craft Machine"],
  ["extinct ballerina","Extinct Event"],
  ["tractoro dinosauro","The Red Carpet"],
  ["belula beluga","Brainrot Trader"],
  ["capi taco","Taco Event"],
  ["corn corn corn sahur","The PiÃ±ata"],
  ["brasilini berimbini","Admin Abuse"],
  ["squalanana","Cyber Craft"],
  ["vampira cappucina","Halloween Event"],
  ["jacko jack jack","Witch's Fuse"],
  ["snailenzo","Witch's Fuse"],
  ["tentacolo tecnico","Witch's Fuse"],
  ["pakrahmatmatina","Pole Game"],
  ["bambu bambu sahur","Indonesia Event"],
  ["krupuk pagi pagi","Indonesia Event"],
  ["skull skull skull","Halloween Event"],
  ["aquanaut","The Red Carpet"],
  ["frio ninja","Witch's Fuse"],
  ["money money man","Brainrot Trader"],
  ["noo la polizia","Brainrot Trader"],
  ["granchiello spiritell","Fishing Event"],
  ["ballerina peppermintina","Advent/Winter Hour"],
  ["ginger globo","Santa's Fuse"],
  ["ginger cisterna","Santa's Fuse"],
  ["yeti claus","Santa's Fuse"],
  ["buho de noelo","Santa's Fuse"],
  ["cocoa assassino","Christmas Event"],
  ["tootini shrimpini","New Year's Event"],
  ["boba panda","OG Fuse"],
  ["dolphini jetskini","OG Fuse"],
  ["divino platypio","Divine Fuse"],
  ["astrolero cervalero","Divine Fuse"],
  ["dumborino miracello","Divine Fuse"],
  ["pineaplino","DLC Code"],
  ["lazy ducky","DLC Code"],
  ["cola cat","OG Craft"],
  ["tenini ballini","DLC Code"],
  ["appelini","The Red Carpet"],
  ["trenotubo axolotrico 9000","Cyber Craft"],
  ["pretzo robo","Cyber Craft"],
  ["lumaca malefica","Backrooms Event"],
  ["robo grafito","Backrooms Event"],
  ["sundrilla sundae","Summer Fuse"],
  ["lemonita splashita","Summer Fuse"],
  ["flippo marino","Summer Fuse"],
  ["la vacca saturno saturnita","The Red Carpet"],
  ["los tralaleritos","The Red Carpet"],
  ["graipuss medussi","The Red Carpet"],
  ["la grande combinasion","The Red Carpet"],
  ["sammyni spyderini","Admin Abuse"],
  ["garama and madundung","The Red Carpet"],
  ["las tralaleritas","The Red Carpet"],
  ["nuclearo dinossauro","The Red Carpet"],
  ["las vaquitas saturnitas","La Vacca Ritual"],
  ["chicleteira bicicleteira","The Red Carpet"],
  ["agarrini la palini","First Fuse Machine"],
  ["los combinasionas","First Fuse Machine"],
  ["karkerkar kurkur","Admin Abuse"],
  ["dragon cannelloni","The Red Carpet"],
  ["los hotspotsitos","First Fuse Machine"],
  ["nooo my hotspot","Taco Event"],
  ["los matteos","Matteo Ritual"],
  ["job job job sahur","The Red Carpet"],
  ["dul dul dul","Admin Abuse"],
  ["los spyderinis","Spyderini Ritual"],
  ["ketupat kepat","The Red Carpet"],
  ["la supreme combinasion","First Fuse Machine"],
  ["bisonte giuppitere","This is obtained from Sammy's Base"],
  ["ketchuru and musturu","The Red Carpet"],
  ["trenostruzzo turbo 4000","First Craft Machine"],
  ["fragola la la la","First Craft Machine"],
  ["la sahur combinasion","First Craft Machine"],
  ["la karkerkar combinasion","First Craft Machine"],
  ["tralaledon","First Craft Machine"],
  ["los bros","First Craft Machine"],
  ["los chicleteiras","Chicleteira Ritual"],
  ["chachechi","Admin Abuse"],
  ["extinct tralalero","Extinct Event"],
  ["extinct matteo","Extinct Event"],
  ["extinct cannelloni","Extinct Lucky Block"],
  ["extinct elephant","Extinct Lucky Block"],
  ["las sis","First Craft Machine"],
  ["celularcini viciosini","First Craft Machine"],
  ["la extinct grande","Extinct Event"],
  ["tacorita bicicleta","Taco Event"],
  ["la cucaracha","Admin Abuse"],
  ["to to to sahur","The Red Carpet"],
  ["mariachi corazoni","The PiÃ±ata"],
  ["los tacoritas","First Craft Machine"],
  ["tictac sahur","The Red Carpet"],
  ["yess my examen","Dul Dul Ritual"],
  ["karker sahur","First Craft Machine"],
  ["noo my examen","Dul Dul Ritual"],
  ["money money puggy","The Red Carpet"],
  ["los primos","First Craft Machine"],
  ["tang tang keletang","The Red Carpet"],
  ["perrito burrito","Limited Quantity Craft"],
  ["chillin chili","Limited Quantity Craft"],
  ["los karkeritos","Karker Ritual"],
  ["zombie tralala","Halloween Event"],
  ["vulturino skeletono","Witch's Fuse"],
  ["frankentteo","Halloween Event"],
  ["la vacca jacko linterino","Halloween Event"],
  ["chicleteirina bicicleteirina","The Red Carpet"],
  ["eviledon","Witch's Fuse"],
  ["la spooky grande","Limited Quantity Craft"],
  ["los mobilis","Witch's Fuse"],
  ["spooky and pumpky","Witch's Fuse"],
  ["boatito auratito","Admin Abuse"],
  ["horegini boom","Aura Boat"],
  ["rang ring bus","Pole Game"],
  ["mieteteira bicicleteira","Witch's Fuse"],
  ["quesadillo vampiro","Limited Quantity Craft"],
  ["chipso and queso","Limited Quantity Craft"],
  ["pot pumpkin","Halloween Event"],
  ["noo my candy","Trick Or Treat"],
  ["la taco combinasion","Limited Quantity Craft"],
  ["1x1x1x1","Cave Ritual"],
  ["john doe","Cave Ritual"],
  ["capitano moby","The Red Carpet"],
  ["guest 666","Cave Ritual"],
  ["pirulitoita bicicleteira","Brainrot Trader"],
  ["los puggies","Brainrot Trader"],
  ["los spaghettis","Brainrot Trader"],
  ["fragrama and chocrama","Brainrot Trader"],
  ["swag soda","Brainrot Trader"],
  ["orcaledon","Brainrot Trader"],
  ["cuadramat and pakrahmatmamat","Brainrot Trader"],
  ["fishino clownino","Fishing Event"],
  ["los planitos","Brainrot Trader"],
  ["w or l","Limited Quantity Craft"],
  ["lavadorito spinito","The Red Carpet"],
  ["gobblino uniciclino","Thanksgiving Event"],
  ["giftini spyderini","This was obtained from the North Pole"],
  ["cooki and milki","Santa's Fuse"],
  ["25","Advent Calendar"],
  ["la vacca prese presente","Santa's Fuse"],
  ["reindeer tralala","Christmas Event"],
  ["santteo","Christmas Event"],
  ["please my present","Advent Calendar"],
  ["list list list sahur","Christmas Event"],
  ["ho ho ho sahur","Santa's Fuse"],
  ["chicleteira noelteira","Santa's Fuse"],
  ["la jolly grande","Christmas Wheel Spin"],
  ["los candies","Santa's Fuse"],
  ["naughty naughty","Christmas Event"],
  ["noo my present","Christmas Event"],
  ["festive 67","DLC Code"],
  ["swaggy bros","Limited Quantity Craft"],
  ["tosto dino","Limited Quantity Craft"],
  ["bunnyman","Advent Calendar"],
  ["dragon gingerini","Santa's Fuse"],
  ["donkeyturbo express","Christmas Event"],
  ["money money reindeer","Santa's Market"],
  ["los jolly combinasionas","Santa's Market"],
  ["jolly jolly sahur","Santa's Market"],
  ["ginger gerat","Santa's Market"],
  ["rocco disco","New Year's Event"],
  ["bunito bunito spinito","New Year's Event"],
  ["tuff toucan","New Year's Event"],
  ["cerberus","The Red Carpet"],
  ["goat","Admin Abuse"],
  ["brunito marsito","This was spawned during Bruno's Concert Event"],
  ["los trios","OG Fuse"],
  ["chill puppy","OG Fuse"],
  ["arcadopus","Tsunami LTM"],
  ["spinny hammy","OG Fuse"],
  ["bacuru and egguru","OG Fuse"],
  ["ketupat bros","OG Fuse"],
  ["hydra dragon cannelloni","OG Fuse"],
  ["mi gatito","Admin Abuse"],
  ["los mi gatitos","Mi Gatito Ritual"],
  ["popcuru and fizzuru","OG Fuse"],
  ["cupid cupid sahur","Cupid's Machine"],
  ["lovin rose","Cupid's Machine"],
  ["la romantic grande","Limited Quantity Craft"],
  ["love love bear","Cupid's Machine"],
  ["los sweethearts","First Fuse Machine"],
  ["tirilikalika tirilikalako","First Craft Machine"],
  ["antonio","First Craft Machine"],
  ["elefanto frigo","First Craft Machine"],
  ["signore carapace","First Craft Machine"],
  ["fishboard","The Red Carpet"],
  ["dj panda","The Red Carpet"],
  ["ventoliero pavonero","The Red Carpet"],
  ["tacorillo crocodillo","Limited Quantity Craft"],
  ["nacho spyder","Limited Quantity Craft"],
  ["paradiso axolottino","Divine Fuse"],
  ["serafinna medusella","Divine Fuse"],
  ["cigno fulgoro","Divine Fuse"],
  ["los cupids","Divine Fuse"],
  ["griffin","Divine Fuse"],
  ["cloverat clapat","St Patricks Event"],
  ["dug dug dug","First Craft Machine"],
  ["la lucky grande","Limited Quantity Craft"],
  ["eid eid eid sahur","Eid Event"],
  ["granny","Granny's Funeral Event"],
  ["foxini lanternini","Eid Event"],
  ["buntteo","Easter Event"],
  ["bunny bunny bunny sahur","Easter Event"],
  ["noo my eggs","Easter Event"],
  ["la easter grande","Limited Quantity Craft"],
  ["quackini snackini","Egg Town Event"],
  ["boppin bunny","DLC Code"],
  ["bunny and eggy","Divine Fuse"],
  ["globa steppa","DLC Code"],
  ["rico dinero","DLC Code"],
  ["pancake and syrup","DLC Code"],
  ["arcadragon","DLC Code"],
  ["berryno","The Red Carpet"],
  ["bananito","The Red Carpet"],
  ["cash or card","The Red Carpet"],
  ["los mariachis","The PiÃ±ata"],
  ["buho de volto","Cyber Craft"],
  ["futbolini skatini","Cyber Craft"],
  ["camera ramena","Cyber Craft"],
  ["gym bros","Cyber Craft"],
  ["money money bros","Cyber Craft"],
  ["los chillis","Cyber Craft"],
  ["los hackers","Cyber Craft"],
  ["duggy bros","Cyber Craft"],
  ["kalika bros","Cyber Craft"],
  ["digi narwhal","Cyber Craft"],
  ["flancito","SAB's Anniversary Event"],
  ["la anniversary grande","Limited Quantity Craft"],
  ["sammyni cakini","SAB's Anniversary Event"],
  ["jelly moby","SAB's Anniversary Event"],
  ["glaciator","Backrooms Event"],
  ["flipa sandala","Backrooms Event"],
  ["abyssaloco","Backrooms Event"],
  ["rubrikiko","Backrooms Event"],
  ["bombardiro vaccariro","Summer Fuse"],
  ["ombrello topolino","Summer Fuse"],
  ["capitano gullini","Summer Fuse"],
  ["coco and mango","Summer Fuse"],
  ["dragon aquanini","Summer Fuse"],
  ["steakini fattini","Limited Quantity Craft"],
  ["caylusaurus","Limited Quantity Craft"],
  ["rocketini frostini","Sammy's Code"],
  ["beavo potto","Bee Block"],
  ["frullato framingo","Sammy's Code"],
  ["los fruits","Summer Fuse"],
  ["hippo golazo","Soccer Board"],
  ["koala parabala","OG Craft"],
  ["hippo jacuzzo","OG Craft"],
  ["ref ref ref sahur","Soccer Board"],
  ["esok goala","Soccer Board"],
  ["los admins","Los Traders"],
  ["venuspino","Summer Fuse"],
  ["gelato lumacho","Summer Hour"],
  ["aquarino","Summer Hour"],
  ["chicleteira surfeiteira","Summer Hour"],
  ["la summer grande","Limited Quantity Craft"],
  ["penguino pumpkino","Haunted Fuse"],
  ["frostino vampiro","Haunted Fuse"],
  ["vampi ribbitini","Haunted Fuse"],
  ["mummelo bandello","Haunted Fuse"],
  ["mortaruga","Haunted Fuse"],
  ["los treaters","Haunted Fuse"],
  ["fangaro lupino","Haunted Fuse"],
  ["oni oni panda","Haunted Fuse"],
  ["sammyni spookyni","Haunted Fuse"],
  ["plant bros","Haunted Fuse"],
  ["phoenix","Haunted Fuse"],
  ["burrito bat","Taco Merchant"],
  ["tacoturbo tacorito","Taco Merchant"],
  ["nachorilla","Taco Merchant"],
  ["sammyni truckini","Taco Merchant"],
  ["honey honey narwhal","Bee Block"],
  ["rosatops triceratino","Bee Block"],
  ["syrup samurai","Bee Block"],
  ["motorino bumbino","Bee Block"],
  ["pop pop petalini","Bee Block"],
  ["orchidox","Bee Block"],
  ["gub","The Red Carpet"],
  ["sir mangus","The Red Carpet"],
  ["gattino hydrantino","RNG Machine"],
  ["puffino builderino","RNG Machine"],
  ["pelican pachetto","OG Craft"],
  ["deputy leopard","OG Craft"],
  ["chicli chicla","OG Craft"],
  ["panda popanda","OG Craft"],
  ["hydra serpent","The Red Carpet"],
  ["zebrino pianino","OG Craft"],
  ["la craft machine","OG Craft"],
  ["gold and diamond","OG Craft"],
  ["los dragons","OG Craft"],
  ["ranito pepito","Jump for Eggs LTM"],
  ["ski ski skunki","Jump for Eggs LTM"],
  ["capibaro celestino","Jump for Eggs LTM"],
  ["pin pin pengu","Jump for Eggs LTM"],
  ["rexino ramino","Jump for Eggs LTM"],
  ["rockarino rockara","Jump for Eggs LTM"],
  ["qamar camelamp","Jump for Eggs LTM"],
  ["marino submarino","Jump for Eggs LTM"],
  ["lavamanta","Jump for Eggs LTM"],
  ["lionello casarello","Jump for Eggs LTM"],
  ["draculino","Jump for Eggs LTM"],
  ["candi corni","Skull Lucky Block"],
  ["grim cheese","Skull Lucky Block"],
  ["zombie bowl","Skull Lucky Block"],
  ["bananito skelito","Skull Lucky Block"],
  ["bat in the box","Skull Lucky Block"],
  ["boo boo rocket","Skull Lucky Block"],
  ["flying dutchman","Skull Lucky Block"],
  ["cobra gelato","DLC Code"],
  ["dragon skeletonini","Skull Lucky Block"],
  ["skelly and coffy","Skeleton Event"],
  ["medusini and demonini","Haunted Fuse"],
  ["arca bros","DLC Code"],
  ["chicken zombie","Skeleton Event"],
  ["co co co sahur","Skeleton Event"],
  ["slushi huski","DLC Code"],
  ["skibidi toilet","The Red Carpet"],
  ["strawberry elephant","The Red Carpet"],
  ["headless horseman","Witch's Fuse"],
  ["meowl","The Red Carpet"],
  ["john pork","The Red Carpet"],
  ["los secret combinasionas","Los Traders"],
  ["spooky bros","Sakumi Games Halloween Shirt"],
  ["4th bros","Admin Abuse"],
  ["bufalino boomberino","Limited Quantity Craft"],
  ["bumbatron","Bee Merchant"],
  ["candini fluffini","RNG Machine"],
  ["cangurato gelato","The Red Carpet"],
  ["capitano americano","Limited Quantity Craft"],
  ["chicleteira champeona","Spain Event"],
  ["conetto morsetto","Bee Merchant"],
  ["examen bros","Los Traders"],
  ["gelatina volatina","RNG Machine"],
  ["grabatron","DLC Codes"],
  ["honey honey bear","Bee Merchant"],
  ["la breakfast combinasion","RNG Machine"],
  ["la fuse machine","RNG Machine"],
  ["los cornis","Los Traders"],
  ["los sigmas","Los Traders"],
  ["los tangcitos","Los Traders"],
  ["los tictacs","Los Traders"],
  ["moby bros","Los Traders"],
  ["noo my resume","Job Ritual"],
  ["noodle noodle poodle","The Red Carpet"],
  ["peschito machito","RNG Machine"],
  ["pogo pogo penguin","RNG Machine"],
  ["polaroidini","DLC Codes"],
  ["quackalena","RNG Machine"],
  ["queen bee","Bee Merchant"],
  ["rubiko and kubiko","Los Traders"],
  ["s more serat","Bee Merchant"],
  ["scorpino coasterino","RNG Machine"],
  ["tic tic ribbit","RNG Machine"],
  ["toro espa olo","Spain Event"],
  ["var var var","Soccer Board"],
  ["yess my resume","Job Ritual"],
  ["yetimatic","RNG Machine"]
]);

function brainrotObtainSource(question) {
  const q = normalizeDirect(question).replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const match = q.match(/^(?:how|where) (?:do you |can (?:i|you|we) |did (?:i|you|we) |you |to )?(?:obtain|get|find|unlock|acquire) (.+)$/)
    || q.match(/^(?:how|where) (?:is|was) (.+) (?:obtained|acquired|found|unlocked)(?: from)?$/)
    || q.match(/^(?:where|what machine|what fuse|what event) (?:does|did) (.+) (?:come from|release in)$/)
    || q.match(/^(?:(?:what is|whats|what s) )?(?:the )?(?:obtain source|acquisition source|source) (?:of|for) (.+)$/);
  if (!match) return null;
  const name = match[1].replace(/^the /, "").replace(/ brainrot$/, "");
  return BRAINROT_OBTAIN_SOURCES.get(name) || null;
}

const brainrotKey = value => normalizeDirect(value).replaceAll("'", "");
const brainrotsByName = new Map(BRAINROT_CATALOG.map(entry => [brainrotKey(entry[0]), entry]));
const directoryByName = new Map(directoryMetadata.map(row => [brainrotKey(row[0]), row]));
for (const [name, , , income, date] of directoryMetadata) {
  const key = brainrotKey(name);
  if (!brainrotsByName.has(key) && income > 0) {
    brainrotsByName.set(key, [name, income, /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= "2025-05-15" ? date : null]);
  }
}
const sourcesByName = new Map([...BRAINROT_OBTAIN_SOURCES].map(([name, source]) => [brainrotKey(name), source]));
const BRAINROT_REFERENCE = [...brainrotsByName.values()].map(([name, income, release]) => {
  const [, rarity, cost, directoryIncome, , directorySources] = directoryByName.get(brainrotKey(name)) ?? [];
  return {name, income:income > 0 ? income : null, release, rarity, cost:OG_PRICES[name] ?? cost,
    directoryIncome, directorySources, source:sourcesByName.get(brainrotKey(name)) ?? null};
});

function formatBrainrotReference({name, income, release, source}) {
  return [name, income == null ? "unknown" : formatBrainrotIncome(income) + "/s", release ?? "unknown", source ?? "unknown"].join(" | ");
}

function brainrotCard({name, income, release, rarity, cost, source, directorySources, directoryIncome}) {
  const lines = [
    "Brainrot: " + name,
    "Base income per second: " + (income == null ? "unknown" : formatBrainrotIncome(income) + "/s (" + income + ")"),
    "Rarity: " + (rarity ?? "unknown"),
    "Base purchase price: " + (cost > 0 ? formatBrainrotIncome(cost) : "unknown"),
    "Documented debut: " + (release ?? "unknown"),
    "Animals acquisition source: " + (source ?? "unknown")
  ];
  if (directorySources?.length) lines.push("Directory acquisition tags: " + directorySources.join(", "));
  if (directoryIncome > 0 && income != null && directoryIncome !== income) {
    lines.push("Directory reports " + formatBrainrotIncome(directoryIncome) + "/s. Keep the game snapshot value above unless real SAB supplies a live value.");
  }
  return lines;
}

const REFERENCE_COLUMNS = {
  rebirth:"Level | required cash | required Brainrots | multiplier",
  "lucky-blocks":"Block | drop | chance",
  rituals:"Ritual | spawn | requirements",
  machines:"Machine | reported availability",
  events:"Event | historical dates where supplied",
  "fuse-machine":"Historical fuse outputs and examples",
  "update-log":"Update number | release date"
};
const REFERENCE_SECTIONS = Object.fromEntries(Object.entries(wikiTables).map(([topic, rows]) => [
  topic, topic.toUpperCase() + " — " + REFERENCE_COLUMNS[topic] + "\n" + rows.map(row => row.join(" | ")).join("\n")
]));

const STATIC_INFO_BOOK = [
  "STEAL A BRAINROT INFO BOOK",
  "Catalog snapshot. Unknown fields are unpublished or absent. Acquisition sources are imported from the supplied Animals snapshot. Voltra reads real SAB acquisition sources at runtime when available.",
  "BRAINROTS — Name | base income per second | documented release (YYYY-MM-DD) | acquisition source",
  ...BRAINROT_REFERENCE.map(formatBrainrotReference),
  "\nBRAINROT FACT CARDS",
  ...BRAINROT_REFERENCE.flatMap(brainrotCard),
  "\nMUTATIONS — Name | multiplier | documented release (YYYY-MM-DD)",
  ...WIKI_MUTATIONS.map(([name, value, date]) => [name, value == null ? "unknown" : value + "x", date ?? "unknown"].join(" | ")),
  "\nTRAITS — Name | multiplier | release evidence",
  ...WIKI_TRAITS.map(([name, value]) => [name, value == null ? "unknown" : value + "x", TRAIT_RELEASES[name]?.join(": ") ?? "unknown"].join(" | ")),
  "\nOG BRAINROTS — release order",
  OG_RELEASE_ORDER.join(" | "),
  "\nOG BRAINROTS — highest to lowest base income",
  OG_INCOME_ORDER.join(" | "),
  "\nOG BRAINROTS — base prices",
  ...OG_PRICE_ORDER.map(name => name + " | " + formatBrainrotIncome(OG_PRICES[name])),
  ...Object.values(REFERENCE_SECTIONS),
  "\nSOURCES",
  "https://steal-a-brainrot.org/brainrots — supplemental directory rarity, price, and acquisition tags",
  ...Object.keys(wikiTables).map(topic => "https://stealabrainrot.wiki/wiki/" + topic + "/"),
  "\nSUPPORTED CLUES",
  "Income per second, minute, hour, or day. Compare two named Brainrots by base income or documented debut.",
  "Acquisition source, highest or lowest earner from a named source, and number of catalog entries from a named source.",
  "Release date or date component, OG release order and rankings, mutation and trait multipliers, rankings, and release evidence.",
  "Index exist counts come from the latest saved scan. The public game update timestamp is available through /updates/ws."
].join("\n");

const FULL_REFERENCE_PROMPT = [
  STORED_AI_PROMPT,
  "REFERENCE USE",
  "Use the records below as lookup data. Use only records relevant to the clue.",
  "For base income clues, p/s, $/s, and MPS mean income per second. Return compact lowercase values such as 425m and 545.5m.",
  "Use live real-SAB Animals data when available. Otherwise use the base income printed on the fact card. Directory conflicts are recorded as source notes.",
  "Distinguish a Brainrot's base income, purchase price, rarity, acquisition source, and exist count.",
  "Lucky block percentages refer to the named block. Historical fuse rows refer to the machine described in the source.",
  "A listed event or machine does not establish that it is active right now.",
  "For multipart clues, resolve each part independently and combine answers in clue order.",
  STATIC_INFO_BOOK
].join("\n\n");

function findBrainrot(label) {
  const key = brainrotKey(label).replace(/^the /, "");
  return brainrotsByName.get(key) || brainrotsByName.get(key.replace(/ brainrot$/, ""));
}

function formatReleaseDate(value, format) {
  if (!value) return "unknown";
  const date = new Date(value + "T12:00:00Z");
  const month = new Intl.DateTimeFormat("en-US", {timeZone:"UTC", month:"long"}).format(date).toLowerCase();
  const day = String(date.getUTCDate());
  const year = String(date.getUTCFullYear());
  if (format === "month") return month;
  if (format === "day") return day;
  if (format === "year") return year;
  if (format === "month day") return month + day;
  if (format === "month day year") return month + day + year;
  return [month, day, year].join(" ");
}

function catalogClueAnswer(question, recentContext) {
  if (recentContext) return null;
  const clue = brainrotKey(question).replace(/^(?:what is|what was|whats|tell me) /, "").replace(/^the /, "");
  const property = clue.match(/^(?:rarity|price|cost) (?:of|for) (.+)$/)
    || clue.match(/^how much does (.+) cost$/)
    || clue.match(/^what rarity is (.+)$/);
  if (property) {
    const row = findBrainrot(property[1]);
    const [, rarity, price] = directoryByName.get(brainrotKey(row?.[0])) ?? [];
    if (/\brarity\b/.test(clue.split(property[1])[0])) return rarity ?? null;
    return price > 0 ? formatBrainrotIncome(price) : null;
  }
  const rebirth = clue.match(/^(?:cash|money|multiplier) (?:needed )?(?:for|at) rebirth (\d+)$/);
  if (rebirth) {
    const row = wikiTables.rebirth.find(([level]) => level === rebirth[1]);
    if (!row) return null;
    return clue.startsWith("multiplier") ? row[3].replace(/^x/i, "") : row[1].replace(/[^\w.]/g, "").toLowerCase();
  }
  const update = clue.match(/^(?:when did update (\d+) (?:release|come out)|release date of update (\d+))$/);
  if (update) {
    const row = wikiTables["update-log"].find(([number]) => number === (update[1] ?? update[2]));
    if (row) return formatReleaseDate(row[1]);
  }
  const ritual = clue.match(/^what (?:does|will) (?:the )?(.+ ritual) spawn$/);
  if (ritual) {
    const row = wikiTables.rituals.find(([name]) => brainrotKey(name) === ritual[1]);
    if (row) return row[1];
  }
  const odds = clue.match(/^(?:chance|odds) (?:of|for) (?:getting )?(.+) from (.+)$/);
  if (odds) {
    const row = wikiTables["lucky-blocks"].find(([block, drop]) =>
      brainrotKey(block) === odds[2].replace(/^the /, "") && brainrotKey(drop) === odds[1]);
    if (row) return row[2];
  }
  const multiplier = clue.match(/^(?:which )?(mutation|trait) (?:has|gives) (?:the )?(highest|lowest) (?:income )?multiplier$/)
    || clue.match(/^(highest|lowest) (mutation|trait) multiplier$/);
  if (multiplier) {
    const [, first, second] = multiplier;
    const catalog = [first, second].includes("trait") ? WIKI_TRAITS : WIKI_MUTATIONS.filter(([name]) => name !== "Default");
    const values = catalog.filter(([, value]) => value != null);
    const extreme = [first, second].includes("highest") ? Math.max : Math.min;
    const value = extreme(...values.map(([, factor]) => factor));
    return values.filter(([, factor]) => factor === value).map(([name]) => name).join(", ");
  }
  const comparison = clue.match(/^which (?:brainrot )?(?:makes|earns|generates|produces) (more|less)(?: per second)? (.+) (?:or|vs|versus) (.+)$/);
  if (comparison) {
    const left = findBrainrot(comparison[2]);
    const right = findBrainrot(comparison[3]);
    if (!left || !right || left[1] <= 0 || right[1] <= 0) return null;
    if (left[1] === right[1]) return "tie";
    return ((left[1] > right[1]) === (comparison[1] === "more") ? left : right)[0];
  }
  const order = clue.match(/^which (?:brainrot )?(?:released|came out|was added) (first|earlier|later) (.+) (?:or|vs|versus) (.+)$/);
  if (order) {
    const left = findBrainrot(order[2]);
    const right = findBrainrot(order[3]);
    if (!left?.[2] || !right?.[2]) return null;
    if (left[2] === right[2]) return "tie";
    return ((left[2] < right[2]) === (order[1] !== "later") ? left : right)[0];
  }
  const time = clue.match(/^how much (?:money |cash )?does (.+) (?:make|earn|generate|produce) (?:in |per )(?:a |one )?(minute|hour|day)$/);
  if (time) {
    const entry = findBrainrot(time[1]);
    if (!entry || entry[1] <= 0) return null;
    const seconds = {minute:60, hour:3600, day:86400};
    return formatBrainrotIncome(entry[1] * seconds[time[2]]);
  }
  const source = clue.match(/^(?:which is (?:the )?)?(highest earning|lowest earning|best|worst) brainrot (?:from|obtained from) (.+)$/)
    || clue.match(/^(how many) (?:catalog )?brainrots (?:are |were )?(?:from|obtained from) (.+)$/);
  if (source) {
    const sourceKey = brainrotKey(source[2]).replace(/^the /, "");
    const entries = BRAINROT_REFERENCE.filter(row => row.source && brainrotKey(row.source).replace(/^the /, "") === sourceKey);
    if (!entries.length) return null;
    if (source[1] === "how many") return String(entries.length);
    const ranked = entries.filter(row => row.income != null).sort((a, b) => a.income - b.income);
    return (/lowest|worst/.test(source[1]) ? ranked[0] : ranked.at(-1))?.name ?? null;
  }
  const release = clue.match(/^(?:when did |when was |release date (?:of|for) )(.+?) (mutation|trait)(?: (?:come out|release|released|introduced|added))?$/)
    || clue.match(/^release date (?:of|for) (.+)$/);
  if (release) {
    const name = brainrotKey(release[1]).replace(/^the /, "");
    if (release[2] === "mutation") {
      const row = WIKI_MUTATIONS.find(([label]) => brainrotKey(label).replaceAll(" ", "") === name.replaceAll(" ", ""));
      return row ? formatReleaseDate(row[2]) : null;
    }
    if (release[2] === "trait") return documentedTraitReleaseAnswer(question);
    const row = findBrainrot(name);
    return row ? formatReleaseDate(row[2]) : null;
  }
  return null;
}

function brainrotFactAnswer(question, recentContext="") {
  const q = normalizeDirect(question.replace(/(?:\$|\b(?:p|mps|ps|cash|money))?\s*\/\s*(?:sec(?:ond)?s?|s)\b|\b(?:mps|pps)\b/gi, " per second "));
  const obtainSource = brainrotObtainSource(question);
  if (obtainSource) return obtainSource;
  const ogAnswer = ogBrainrotAnswer(question);
  if (ogAnswer) return ogAnswer;
  const extraFact = catalogClueAnswer(question, recentContext);
  if (extraFact) return extraFact;
  const rank = q.match(/^(?:(?:what is|whats|what's) )?(?:the )?(best|worst|strongest|weakest) (?:new )?brainrot (?:added (?:to|in) (?:the game|sab|the latest update)|from the (?:latest|new) update)$/);
  if (rank) {
    if (Date.now() >= LATEST_BRAINROTS_EXPIRES) return "unknown";
    return /best|strongest/.test(rank[1]) ? LATEST_BRAINROTS[0] : LATEST_BRAINROTS[1];
  }
  const income = q.match(/^how much (?:money |cash )?per second does (.+?)(?: (?:do|make|earn|generate|produce)(?: in (?:the game|sab))?)?$/)
    || q.match(/^(?:what is |whats |what's )?(?:the )?(?:base )?(?:(?:income|generation) )?(?:per second )?(?:of|for) (.+)$/)
    || q.match(/^how much (?:money |cash )?does (.+) (?:do|make|earn|generate|produce) per second$/)
    || q.match(/^(?:(?:what is|whats|what's) (?:the )?)?(.+?)(?:'s)? (?:base income|generation|per second)$/);
  if (income) {
    const entry = findBrainrot(income[1]);
    return entry && entry[1] > 0 && !recentContext ? formatBrainrotIncome(entry[1]) : null;
  }
  const release = q.match(/^(?:what (?:is|was) )?(?:the )?(month (?:and )?(?:the )?day(?: (?:and )?(?:the )?year)?|month|year|day) (?:of |that |when )?(?:the )?(.+) (?:was )?(?:released|came out|come out|added|introduced)$/)
    || q.match(/^(when) (?:did|was) (?:the )?(.+) (?:was )?(?:released|release|came out|come out|added|introduced)$/);
  if (!release || /\b(?:mutation|trait)\b/.test(release[2])) return null;
  const entry = findBrainrot(release[2]);
  if (!entry) return null;
  const format = release[1];
  return formatReleaseDate(entry[2], format.startsWith("month ") ? (format.includes("year") ? "month day year" : "month day") : format);
}

function mutationMonthDayAnswer(question) {
  const clue = normalizeDirect(question);
  const match = clue.match(/^(?:what (?:is|was) )?(?:the )?month (?:and )?(?:the )?day (?:of |that |when )?(?:the )?(.+) mutation (?:was )?(?:released|came out|come out|added|introduced)$/);
  if (!match) return null;
  const name = match[1].replaceAll(" ", "");
  const entry = WIKI_MUTATIONS.find(([label]) => normalizeDirect(label).replaceAll(" ", "") === name);
  if (!entry?.[2]) return null;
  const date = new Date(entry[2] + "T12:00:00Z");
  const month = new Intl.DateTimeFormat("en-US", {timeZone:"UTC", month:"long"}).format(date).toLowerCase();
  return month + date.getUTCDate();
}

function documentedTraitReleaseAnswer(question) {
  const q = normalizeDirect(question);
  const match = q.match(/^when (?:did|was) (?:the )?(.+) trait (?:come out|release|released|added|introduced)$/)
    || q.match(/^(?:(?:what is|what's|whats) )?(?:the )?release date (?:of|for) (?:the )?(.+) trait$/);
  if (!match) return null;
  const entry = Object.entries(TRAIT_RELEASES).find(([name]) => normalizeDirect(name) === match[1]);
  if (entry?.[1][0] !== "documented") return null;
  const date = new Date(entry[1][1] + "T12:00:00Z");
  return new Intl.DateTimeFormat("en-US", {timeZone:"UTC", month:"long", day:"numeric", year:"numeric"})
    .format(date).replace(",", "").toLowerCase();
}

function wikiMultiplierAnswer(question) {
  const q = normalizeDirect(question);
  const clue = q.replace(/^(?:what is|what's|whats) /, "").replace(/^the /, "");
  const kindFirst = clue.match(/^(mutation|trait) multiplier (?:of|for) (?:the )?(.+)$/);
  const nameFirst = clue.match(/^(?:multiplier (?:of|for) (?:the )?)?(.+) (mutation|trait)(?: multiplier)?$/);
  if (!kindFirst && !(nameFirst && clue.includes("multiplier"))) return null;
  const kind = kindFirst ? kindFirst[1] : nameFirst[2];
  const name = kindFirst ? kindFirst[2] : nameFirst[1];
  const catalog = kind === "trait" ? WIKI_TRAITS : WIKI_MUTATIONS;
  const entry = catalog.find(([label]) => normalizeDirect(label) === name);
  return entry ? (entry[1] == null ? "unknown" : String(entry[1])) : null;
}

const CURRENT_MUTATION_CLUES = new Set(["current mutation","active mutation","live mutation","mutation right now","mutation now","mutation today","mutation that is running now","mutation that is active now","mutation that is currently active","mutation is currently active","mutation is currently running","mutation is active","mutation is active now","mutation is active right now","mutation is running","mutation is running now","mutation is running right now","mutation is on right now","mutation is on now","mutation is live","mutation is live now","mutation is it right now","current mutation in the game","active mutation in the game","mutation are we on","mutation are we on now","mutation we are in right now","mutation we are on right now","todays mutation","today's mutation","today s mutation"]);
const HACKER_CURRENT_START = Date.parse("2026-11-20T00:00:00-06:00");
const HACKER_SCHEDULE_END = Date.parse("2026-11-21T00:00:00-06:00");

function normalizeMutationNameClue(question) {
  return normalizeDirect(question)
    .replace(/^(?:(?:what|which)(?: is)?|whats|what's|name) /, "")
    .replace(/^the /, "").replace(/ (?:called|name)$/, "");
}

const NEXT_MUTATION_CLUES = new Set(["next mutation","upcoming mutation","next upcoming mutation","mutation that comes next","mutation comes next","mutation is next","mutation is coming next","mutation that is coming next","mutation is coming out next","mutation that comes out next","mutation comes out next","mutation coming next","mutation coming out next","mutation are we getting next","mutation we are getting next","mutation will come next","mutation that will come next","mutation will be released next","mutation is releasing next","mutation releases next","mutation that releases next","mutation will be next","mutation after this one"]);

function isCurrentMutationClue(question) {
  return CURRENT_MUTATION_CLUES.has(normalizeMutationNameClue(question));
}

function isNextMutationClue(question) {
  return NEXT_MUTATION_CLUES.has(normalizeMutationNameClue(question));
}

function scheduledMutationAnswer(question) {
  const now = Date.now();
  if (isCurrentMutationClue(question) && now >= HACKER_CURRENT_START && now < HACKER_SCHEDULE_END) {
    return "hacker";
  }
  const q = normalizeDirect(question).replace(/\bnext upcoming mutation\b/g, "next mutation");
  if (isNextMutationClue(question)) return now < HACKER_SCHEDULE_END ? "hacker" : null;
  const asksAboutHacker = /\bhacker mutation\b/.test(q);
  const asksAboutNext = /\b(?:next|upcoming) mutation\b/.test(q);
  if (!asksAboutHacker && !asksAboutNext) return null;
  if (!asksAboutHacker && now >= HACKER_SCHEDULE_END) return null;
  if (/\b(?:modifier|multiplier|odds|chance|income)\b/.test(q)) return null;
  if (/\b(?:what month|which month)\b/.test(q)) return "november";
  if (/\b(?:what year|which year)\b/.test(q)) return "2026";
  if (/\b(?:day of the month|day in november)\b/.test(q)) return "21";
  if (/\b(?:what day|which day|what weekday)\b/.test(q)) return "saturday";
  if (/\b(?:when|date|release date)\b/.test(q)) return "november 21 2026";
  return /^(?:(?:what is|whats|what's|name) (?:the )?)?(?:next|upcoming) mutation(?: (?:called|name))?$/.test(q)
    ? "hacker" : null;
}

function looksSabSpecific(question) {
  const q = normalizeDirect(question);
  return /\b(brainrots?|mutations?|rarity|fuse|craft|lucky blocks?|rebirth|rituals?|machines?|admin abuse|sammy|meowl|jandelini|exist count|index|traits?|base skin|red carpet|income per second|generation|og)\b/.test(q);
}

function centralDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).formatToParts(date);

  const out = {};
  for (const part of parts) {
    if (part.type !== "literal") out[part.type] = part.value;
  }
  return out;
}

function currentPromptContext() {
  const p = centralDateParts();
  return [
    "CURRENT DATE CONTEXT (America/Chicago):",
    "weekday=" + (p.weekday || ""),
    "month=" + (p.month || ""),
    "day=" + (p.day || ""),
    "year=" + (p.year || "")
  ].join("\n");
}

function directDateAnswer(question) {
  const q = normalizeDirect(question);

  let offsetDays = 0;

  if (q.includes("day after tomorrow")) {
    offsetDays = 2;
  } else if (q.includes("day before yesterday")) {
    offsetDays = -2;
  } else if (q.includes("tomorrow")) {
    offsetDays = 1;
  } else if (q.includes("yesterday")) {
    offsetDays = -1;
  } else {
    const future =
      q.match(/\bin\s+(\d+)\s+days?\b/) ||
      q.match(/\b(\d+)\s+days?\s+from\s+now\b/) ||
      q.match(/\b(\d+)\s+days?\s+later\b/);

    const past =
      q.match(/\b(\d+)\s+days?\s+ago\b/) ||
      q.match(/\b(\d+)\s+days?\s+before\s+today\b/);

    if (future) offsetDays = Number(future[1]) || 0;
    if (past) offsetDays = -(Number(past[1]) || 0);
  }

  const when = new Date(Date.now() + offsetDays * 86400000);
  const p = centralDateParts(when);

  const asksDay =
    q.includes("date of the month") ||
    q.includes("day of the month") ||
    q.includes("day of month") ||
    q.includes("todays date") ||
    q.includes("today's date") ||
    q.includes("today date") ||
    q.includes("yesterdays date") ||
    q.includes("yesterday's date") ||
    q.includes("tomorrows date") ||
    q.includes("tomorrow's date") ||
    q === "date" ||
    q === "day" ||
    q === "current date" ||
    q === "current day" ||
    /^(?:what is )?(?:the )?day today$/.test(q);

  if (asksDay && p.day) return String(p.day);
  if ((q === "month" || q === "current month" || q.includes("what month")) && p.month) {
    return String(p.month).toLowerCase();
  }
  if ((q === "year" || q === "current year" || q.includes("what year")) && p.year) {
    return String(p.year);
  }
  return null;
}

function directContextAnswer(question, context) {
  const q = normalizeDirect(question);
  const c = String(context || "").toLowerCase();

  const asksDevice =
    q.includes("device") &&
    (q.includes("using") || q.includes("on") || q.includes("right now"));

  if (asksDevice && c) {
    const lines = c.split(/\r?\n/).reverse();
    for (const line of lines) {
      if (/\biphone\b|\bphone\b|\bmobile\b/.test(line)) return "phone";
      if (/\blaptop\b/.test(line)) return "laptop";
      if (/\bipad\b/.test(line)) return "ipad";
      if (/\btablet\b/.test(line)) return "tablet";
      if (/\bdesktop\b|\bcomputer\b|\bpc\b/.test(line)) return "computer";
    }
  }

  return null;
}

const cleanFragment = value => String(value ?? "")
  .replace(/\r/g, "")
  .trim()
  .split(/\n+/)[0]
  .replace(/^(?:ANSWER|CODE)\s*:\s*/i, "")
  .split(/\s*\|\|\s*ALT\s*:/i)[0]
  .replace(/^['"`]+|['"`]+$/g, "")
  .trim();

function splitMultipart(question) {
  let raw = String(question || "").trim();

  raw = raw.replace(/^\s*(?:riddle|question|clue)\s*(?:is)?\s*[:\-]\s*/i, "");

  raw = raw.replace(/\s*\d+\s*\/\s*\d+\s*[:\-]\s*/g, "\n");

  let pieces = raw
    .split(/[;,\n]+|\?\s*(?=(?:and\s+)?(?:what|how|who|when|where|which)\b)|\s+and\s+(?=(?:(?:what|how|who|when|where|which)\b|(?:the\s+)?day\s+today\b))/i)
    .map((piece, index) => index ? piece.trim().replace(/^and\s+/i, "") : piece.trim())
    .filter(Boolean);

  if (pieces.length === 1) {
    const m = raw.match(/^(.*\D)\s+(-?\d+(?:\.\d+)?%?)\s*$/);
    if (m && m[1].trim()) pieces = [m[1].trim(), m[2]];
  }

  return pieces;
}

function isLiveIndexQuestion(question) {
  const q = normalizeDirect(question);
  return (
    q.includes("exist count") ||
    q.includes("copies") ||
    q.includes("cached exist") ||
    q.includes("exist cache") ||
    q.includes("index total") ||
    q.includes("brainrots in the index") ||
    q.includes("mutations scanned") ||
    q.includes("mutation scan count") ||
    /how many .* exist/.test(q)
  );
}

function edgeCacheKey(url, question) {
  const u = new URL(url);
  u.pathname = "/__answer_cache/" + WORKER_CACHE_VERSION + "/" + encodeURIComponent(normalizeDirect(question));
  u.search = "";
  return new Request(u.toString(), {method:"GET"});
}

async function getEdgeAnswer(url, question) {
  if (isLiveIndexQuestion(question) || typeof caches === "undefined") return null;

  try {
    const hit = await caches.default.match(edgeCacheKey(url, question));
    if (!hit) return null;

    const data = await hit.json();
    const answer = cleanFragment(data?.answer);
    return answer || null;
  } catch {
    return null;
  }
}

async function putEdgeAnswer(ctx, url, question, answer) {
  if (isLiveIndexQuestion(question) || typeof caches === "undefined") return;

  const clean = cleanFragment(answer);
  if (!clean) return;

  ctx.waitUntil((async()=>{
    try {
      await caches.default.put(
        edgeCacheKey(url, question),
        new Response(JSON.stringify({answer:clean}), {
          headers:{
            "content-type":"application/json",
            "cache-control":"public, max-age=21600"
          }
        })
      );
    } catch {}
  })());
}

let infoBookCacheText = "";
let infoBookCacheUntil = 0;

async function getInfoBook(url, env, ctx, forceFresh=false) {
  const now = Date.now();

  // Static/general riddles can reuse the already-built Info Book briefly.
  // Live exist-count questions bypass this cache.
  if (!forceFresh && infoBookCacheText && now < infoBookCacheUntil) {
    return infoBookCacheText;
  }

  const response = await baseWorker.fetch(
    new Request(new URL("/", url), {method:"GET"}),
    env,
    ctx
  );

  if (!response.ok) throw new Error("Info Book unavailable");

  const text = await response.text();

  if (!forceFresh) {
    infoBookCacheText = text;
    infoBookCacheUntil = now + 60000;
  }

  return text;
}


function selectInfoBookContext(question, infoBook, maxChars=28000) {
  const source = String(infoBook || "");
  if (!source || source.length <= maxChars) return source;

  const stop = new Set([
    "the","a","an","of","in","on","at","for","from","to","is","are","was","were",
    "what","which","who","when","where","how","my","me","i","his","her","their",
    "best","worst","highest","lowest","most","least","brainrot","brainrots"
  ]);

  const q = normalizeDirect(question);
  const tokens = [...new Set(
    q.split(/\s+/)
      .map(v => v.replace(/[^a-z0-9]/g, ""))
      .filter(v => v.length >= 3 && !stop.has(v))
  )];

  const lines = source.split(/\r?\n/);
  const scored = [];

  for (let i=0; i<lines.length; i++) {
    const normalized = normalizeDirect(lines[i]);
    if (!normalized) continue;

    let score = 0;
    for (const token of tokens) {
      if (normalized.includes(token)) {
        score += token.length >= 8 ? 7 : token.length >= 5 ? 4 : 2;
      }
    }

    if (q.includes("fuse") && normalized.includes("fuse")) score += 5;
    if (q.includes("mutation") && normalized.includes("mutation")) score += 5;
    if (q.includes("trait") && normalized.includes("trait")) score += 5;
    if (q.includes("lucky block") && normalized.includes("lucky block")) score += 6;
    if (q.includes("rarity") && normalized.includes("rarity")) score += 4;
    if ((q.includes("income") || q.includes("generation")) && normalized.includes("generation")) score += 5;
    if ((q.includes("price") || q.includes("cost")) &&
        (normalized.includes("price") || normalized.includes("cost"))) score += 5;

    if (score > 0) scored.push({i, score});
  }

  if (!scored.length) return source.slice(0, maxChars);

  scored.sort((a,b) => b.score - a.score || a.i - b.i);

  const selected = new Set();
  for (const row of scored.slice(0, 140)) {
    for (let j=Math.max(0,row.i-2); j<=Math.min(lines.length-1,row.i+2); j++) {
      selected.add(j);
    }
  }

  let out = "";
  for (const i of [...selected].sort((a,b)=>a-b)) {
    const next = lines[i] + "\n";
    if (out.length + next.length > maxChars) break;
    out += next;
  }

  return out || source.slice(0, maxChars);
}

function uniqueModels(env) {
  const values = [
    env.GEMINI_MODEL,
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash",
    "gemini-3.5-flash"
  ].filter(Boolean);

  return [...new Set(values.map(v => String(v).trim()).filter(Boolean))];
}

function generationConfigFor(model, maxOutputTokens) {
  const config = {
    temperature: 0,
    topP: 0.1,
    candidateCount: 1,
    // Gemini 3 thinking tokens count toward this budget too. Keep enough room
    // that a short answer is not accidentally cut off during reasoning.
    maxOutputTokens: Math.max(Number(maxOutputTokens) || 128, 768)
  };

  if (String(model).startsWith("gemini-3")) {
    config.thinkingConfig = {
      thinkingLevel: "low"
    };
  }

  return config;
}

async function callGemini(env, prompt, maxOutputTokens=128) {
  if (!env.GEMINI_API_KEY) {
    return {ok:false,status:503,error:"AI provider not configured"};
  }

  const models = uniqueModels(env);
  let lastStatus = 0;
  let lastError = "AI temporarily unavailable";

  for (const model of models) {
    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/" +
      encodeURIComponent(model) +
      ":generateContent";

    const requestBody = JSON.stringify({
      contents: [{
        role:"user",
        parts:[{text:String(prompt)}]
      }],
      generationConfig: generationConfigFor(model, maxOutputTokens)
    });

    for (let attempt=1; attempt<=2; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method:"POST",
          headers:{
            "content-type":"application/json",
            "x-goog-api-key":String(env.GEMINI_API_KEY)
          },
          body:requestBody
        });

        lastStatus = response.status;

        if (response.ok) {
          const data = await response.json();

          const answer = String(
            data?.candidates?.[0]?.content?.parts
              ?.map(part => part?.text || "")
              .join("") || ""
          ).trim();

          if (answer) {
            return {
              ok:true,
              status:response.status,
              answer,
              model
            };
          }

          const finishReason =
            data?.candidates?.[0]?.finishReason ||
            data?.promptFeedback?.blockReason ||
            "empty";

          lastError = "Empty AI answer: " + finishReason;
          console.error("Gemini empty answer", JSON.stringify({
            model,
            finishReason
          }));

          // Empty output from one model should try the next model.
          break;
        }

        const errorText = (await response.text()).slice(0,1200);
        lastError = errorText || ("HTTP " + response.status);

        console.error("Gemini upstream error", JSON.stringify({
          model,
          attempt,
          status:response.status,
          body:errorText
        }));

        const modelProblem =
          response.status === 404 ||
          (response.status === 400 &&
            /model|not found|unsupported|unknown|thinking/i.test(errorText));

        if (modelProblem) break;

        const transient =
          response.status === 408 ||
          response.status === 409 ||
          response.status === 429 ||
          response.status >= 500;

        if (!transient || attempt === 2) break;
      } catch (err) {
        lastError = String(
          err?.message || err || "fetch failed"
        ).slice(0,1200);

        console.error("Gemini fetch exception", JSON.stringify({
          model,
          attempt,
          error:lastError
        }));

        if (attempt === 2) break;
      }

      await new Promise(resolve => setTimeout(resolve, 120));
    }
  }

  return {
    ok:false,
    status:502,
    error:"AI unavailable across model fallbacks",
    upstreamStatus:lastStatus || null,
    detail:lastError
  };
}

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

    if (["/info-book", "/info-book/prompt"].includes(url.pathname) && request.method === "GET") {
      const text = url.pathname.endsWith("/prompt") ? FULL_REFERENCE_PROMPT : STATIC_INFO_BOOK;
      return new Response(text, {
        headers:{"content-type":"text/plain; charset=UTF-8", "cache-control":"public, max-age=300"}
      });
    }

    if (url.pathname === "/health" && request.method === "GET") {
      return json({
        ok:true,
        worker:"riddler",
        version:WORKER_CACHE_VERSION,
        aiConfigured:Boolean(env.GEMINI_API_KEY),
        tokenConfigured:Boolean(env.RIDDLER_CLIENT_TOKEN),
        configuredModel:env.GEMINI_MODEL || null,
        fallbackModels:uniqueModels(env),
        mode:"ai-first"
      });
    }

    if (url.pathname === "/probe" && request.method === "POST") {
      const clientToken = request.headers.get("x-riddler-token") || "";
      if (!env.RIDDLER_CLIENT_TOKEN || clientToken !== env.RIDDLER_CLIENT_TOKEN) {
        return json({ok:false,error:"Unauthorized"}, 401);
      }

      const ai = await callGemini(
        env,
        "Return only the exact word OK",
        64
      );

      if (!ai.ok) {
        return json({
          ok:false,
          error:ai.error,
          upstreamStatus:ai.upstreamStatus ?? null,
          detail:ai.detail ?? null
        }, ai.status || 502);
      }

      return json({
        ok:true,
        answer:cleanFragment(ai.answer),
        model:ai.model || null
      });
    }

    if (url.pathname === "/" && request.method === "GET") {
      return new Response(JSON.stringify({ok:false,error:"POST only"}), {status:405, headers:{"content-type":"application/json; charset=UTF-8"}});
    }

    if (url.pathname === "/" && request.method === "POST") {
      url.pathname = "/ask";
      request = new Request(url.toString(), request);
    }

    if (url.pathname !== "/ask") {
      return baseWorker.fetch(request, env, ctx);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status:204,
        headers:{
          "access-control-allow-origin":"*",
          "access-control-allow-headers":"content-type,x-riddler-token",
          "access-control-allow-methods":"POST,OPTIONS"
        }
      });
    }

    if (request.method !== "POST") return json({ok:false,error:"POST only"}, 405);

    const clientToken = request.headers.get("x-riddler-token") || "";
    if (!env.RIDDLER_CLIENT_TOKEN || clientToken !== env.RIDDLER_CLIENT_TOKEN) {
      return json({ok:false,error:"Unauthorized"}, 401);
    }

    let body;
    try { body = await request.json(); }
    catch { return json({ok:false,error:"Invalid JSON"}, 400); }

    const originalQuestion = String(body?.question ?? body?.q ?? "").trim();
    const recentContext = String(body?.context ?? "").trim().slice(0, 6000);
    if (!originalQuestion) return json({ok:false,error:"Missing question"}, 400);
    if (originalQuestion.length > 2000) return json({ok:false,error:"Question too long"}, 413);

    // Zero-cost literal path.
    if (NUMBER_ONLY.test(originalQuestion)) {
      return json({ok:true,answer:originalQuestion});
    }

    const fullOgAnswer = ogBrainrotAnswer(originalQuestion);
    if (fullOgAnswer) return json({ok:true,answer:fullOgAnswer});
    const fullCatalogAnswer = catalogClueAnswer(originalQuestion, recentContext);
    if (fullCatalogAnswer) return json({ok:true,answer:fullCatalogAnswer});
    const pieces = splitMultipart(originalQuestion);
    const useAnswerCache = !recentContext && !/\bbrainrot (?:added|from the (?:latest|new) update)\b/.test(normalizeDirect(originalQuestion)) && !pieces.some(piece => isCurrentMutationClue(piece) || isNextMutationClue(piece) || directDateAnswer(piece) || /\b(?:next|upcoming) mutation\b/.test(normalizeDirect(piece)));
    const knownEventAnswer = piece => recentContext ? null : documentedTraitReleaseAnswer(piece) || wikiMultiplierAnswer(piece) || eventRiddleAnswers.get(normalizeDirect(piece));
    const isMultipart = pieces.length > 1;

    if (!isMultipart) {
      const releaseDate = scheduledMutationAnswer(originalQuestion) || mutationMonthDayAnswer(originalQuestion) || brainrotFactAnswer(originalQuestion, recentContext);
      if (releaseDate) return json({ok:true,answer:releaseDate});
      const genericDirect = directGenericAnswer(originalQuestion);
      if (genericDirect) return json({ok:true,answer:genericDirect});

      const directDate = directDateAnswer(originalQuestion);
      if (directDate) return json({ok:true,answer:directDate});

      const contextDirect = directContextAnswer(originalQuestion, recentContext);
      if (contextDirect) return json({ok:true,answer:contextDirect});

      const direct = directAnswers.get(normalizeDirect(originalQuestion)) || knownEventAnswer(originalQuestion);
      if (direct) return json({ok:true,answer:direct});

      // Fast edge cache first.
      const edgeHit = useAnswerCache && await getEdgeAnswer(url, originalQuestion);
      if (edgeHit) return json({ok:true,answer:edgeHit});

      // Then the existing shared answer store.
      if (useAnswerCache && env.EXIST_RELAY) {
        try {
          const shared = await env.EXIST_RELAY.get(env.EXIST_RELAY.idFromName("eternal")).fetch(
            new Request("https://internal/ai/shared?q=" + encodeURIComponent(originalQuestion))
          );
          if (shared.ok) {
            const hit = await shared.json();
            if (hit?.hit && hit?.answer) {
              const answer = String(hit.answer);
              putEdgeAnswer(ctx, url, originalQuestion, answer);
              return json({ok:true,answer});
            }
          }
        } catch {}
      }
    } else if (useAnswerCache) {
      // Exact repeated multipart riddles can be returned immediately too.
      const edgeHit = await getEdgeAnswer(url, originalQuestion);
      if (edgeHit) return json({ok:true,answer:edgeHit});
    }

    let finalAnswer = "";
    let modelUsed = null;

    if (isMultipart) {
      const slots = new Array(pieces.length);
      const unresolved = [];

      // Resolve literal/direct pieces immediately.
      for (let i=0; i<pieces.length; i++) {
        const piece = pieces[i];

        if (NUMBER_ONLY.test(piece)) {
          slots[i] = piece;
          continue;
        }

        if (slots[i - 1] === "timcheese" && /^how much s does he do(?: in the game)?$/.test(normalizeDirect(piece))) {
          slots[i] = "5";
          continue;
        }

        const genericDirect = directGenericAnswer(piece);
        if (genericDirect) {
          slots[i] = genericDirect;
          continue;
        }

        const releaseDate = scheduledMutationAnswer(piece) || mutationMonthDayAnswer(piece) || brainrotFactAnswer(piece, recentContext);
        if (releaseDate) {
          slots[i] = releaseDate;
          continue;
        }

        const directDate = directDateAnswer(piece);
        if (directDate) {
          slots[i] = directDate;
          continue;
        }

        const contextDirect = directContextAnswer(piece, recentContext);
        if (contextDirect) {
          slots[i] = contextDirect;
          continue;
        }

        const direct = directAnswers.get(normalizeDirect(piece)) || knownEventAnswer(piece);
        if (direct) {
          slots[i] = direct;
          continue;
        }

        unresolved.push({index:i, clue:piece});
      }

      if (unresolved.length === 0) {
        finalAnswer = slots.join("");
        if (useAnswerCache) putEdgeAnswer(ctx, url, originalQuestion, finalAnswer);
        return json({ok:true,answer:finalAnswer,model:modelUsed});
      }

      // Check unresolved clue caches first. Avoid rebuilding the large SAB
      // Info Book for ordinary real-world trivia.
      const cachedPieces = await Promise.all(
        unresolved.map(row => recentContext ? null : getEdgeAnswer(url, row.clue))
      );

      const stillUnresolved = [];
      for (let i=0; i<unresolved.length; i++) {
        const row = unresolved[i];
        const cached = cachedPieces[i];

        if (cached) {
          slots[row.index] = cached;
        } else {
          stillUnresolved.push(row);
        }
      }

      if (stillUnresolved.length === 0) {
        finalAnswer = slots.join("");
        if (useAnswerCache) putEdgeAnswer(ctx, url, originalQuestion, finalAnswer);
        return json({ok:true,answer:finalAnswer});
      }

      const needsInfoBook = stillUnresolved.some(row => looksSabSpecific(row.clue));
      let infoBook = "";

      if (needsInfoBook) {
        try {
          infoBook = await getInfoBook(
            url,
            env,
            ctx,
            isLiveIndexQuestion(originalQuestion)
          );
        } catch (err) {
          console.error("Info Book fetch failed; using fallback context", String(err?.message || err || "unknown"));
          infoBook = "SAB Info Book temporarily unavailable. Solve from the supplied clues and general knowledge. Return only the answers.";
        }
      }

      // ONE AI request for every clue that was not already literal/direct/cached.
      const clueList = stillUnresolved
        .map((row, i) => (i + 1) + ". " + row.clue)
        .join("\n");

      const infoContext = needsInfoBook
        ? selectInfoBookContext(clueList, infoBook)
        : infoBook;

      const prompt =
        buildPromptContext(clueList, {multipart:true, recentContext, infoContext}) +
        "\n\n=== MULTIPART MODE ===\n" +
        "Solve every clue below in order in ONE response.\n" +
        "Return exactly one short answer per clue.\n" +
        "Separate answers ONLY with |||.\n" +
        "No numbering, labels, explanations, markdown, or extra text.\n" +
        "Return exactly " + stillUnresolved.length + " fragments.\n\n" +
        clueList;

      const ai = await callGemini(
        env,
        prompt,
        Math.max(64, Math.min(256, stillUnresolved.length * 48))
      );

      if (!ai.ok) {
        return json({
          ok:false,
          error:ai.error,
          upstreamStatus:ai.upstreamStatus ?? null,
          detail:ai.detail ?? null
        }, ai.status || 502);
      }

      let answers = String(ai.answer)
        .split("|||")
        .map(cleanFragment)
        .filter(v => v !== "");

      if (stillUnresolved.length === 1 && answers.length !== 1) {
        answers = [cleanFragment(ai.answer)];
      }

      if (answers.length !== stillUnresolved.length) {
        console.error("Multipart answer count mismatch", JSON.stringify({
          expected:stillUnresolved.length,
          got:answers.length,
          raw:String(ai.answer).slice(0,800)
        }));
        return json({ok:false,error:"Multipart answer format error"}, 502);
      }

      for (let i=0; i<stillUnresolved.length; i++) {
        const row = stillUnresolved[i];
        const answer = answers[i];
        slots[row.index] = answer;
        if (!recentContext) putEdgeAnswer(ctx, url, row.clue, answer);
      }

      finalAnswer = slots.join("");
    } else {
      let infoBook = "";

      if (looksSabSpecific(originalQuestion)) {
        try {
          infoBook = await getInfoBook(
            url,
            env,
            ctx,
            isLiveIndexQuestion(originalQuestion)
          );
        } catch (err) {
          console.error("Info Book fetch failed; using fallback context", String(err?.message || err || "unknown"));
          infoBook = "SAB Info Book temporarily unavailable. Solve from the supplied question and general knowledge. Return only the answer.";
        }
      }

      const infoContext = looksSabSpecific(originalQuestion)
        ? selectInfoBookContext(originalQuestion, infoBook)
        : infoBook;

      const prompt =
        buildPromptContext(originalQuestion, {recentContext, infoContext}) +
        "\n\n=== QUESTION ===\n" + originalQuestion +
        "\n\nReturn only the final answer.";

      const ai = await callGemini(env, prompt, 96);

      if (!ai.ok) {
        return json({
          ok:false,
          error:ai.error,
          upstreamStatus:ai.upstreamStatus ?? null,
          detail:ai.detail ?? null
        }, ai.status || 502);
      }

      finalAnswer = cleanFragment(ai.answer);
    }

    if (!finalAnswer) return json({ok:false,error:"Empty AI answer"}, 502);

    // Make the next identical request nearly instant and free.
    if (useAnswerCache) putEdgeAnswer(ctx, url, originalQuestion, finalAnswer);

    // Keep the existing shared-answer store in the background.
    if (useAnswerCache && env.EXIST_RELAY) {
      ctx.waitUntil((async()=>{
        try {
          await env.EXIST_RELAY.get(env.EXIST_RELAY.idFromName("eternal")).fetch(
            new Request("https://internal/ai/shared", {
              method:"POST",
              headers:{
                "content-type":"application/json",
                "x-eternal-client-ip":request.headers.get("CF-Connecting-IP") || ""
              },
              body:JSON.stringify({
                question:originalQuestion,
                answer:finalAnswer
              })
            })
          );
        } catch {}
      })());
    }

    return json({ok:true,answer:finalAnswer});
    } catch (err) {
      console.error("Unhandled /ask error", String(err?.stack || err?.message || err || "unknown").slice(0,1600));
      return json({ok:false,error:"Worker internal error"}, 502);
    }
  }
};
