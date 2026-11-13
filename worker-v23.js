import baseWorker from "./worker-v18.js";
import {directoryMetadata, wikiTables} from "./wiki-reference.js";
export { ExistRelay } from "./worker-v18.js";

const WORKER_CACHE_VERSION = "v53";

// Public SAB Wiki tables checked November 11, 2026. Null means unpublished.
// https://stealabrainrot.wiki/wiki/mutations/
// https://stealabrainrot.wiki/wiki/traits/
// https://stealabrainrot.wiki/wiki/traits/seasonal/
// Canonical roster and game fields from the supplied real SAB Animals dump.
// Debuts from explicitly named new-brainrot sections and matched directory records.
// https://stealabrainrot.wiki/wiki/update-log/
// Missing dates are supplemented by the released records at https://steal-a-brainrot.org/brainrots.
// Keep update-log debut dates where the directory disagrees.
const BRAINROT_CATALOG = [
  ["67",7500000,"2025-09-13","Secret",1250000000,null,null,false,false,"67"],
  ["Noobini Pizzanini",1,null,"Common",25,"The Red Carpet",true,false,false,"Noobini Pizzanini"],
  ["Lirilì Larilà",3,null,"Common",250,"The Red Carpet",true,false,false,"Lirilì Larilà"],
  ["Tim Cheese",5,null,"Common",500,"The Red Carpet",true,false,false,"Tim Cheese"],
  ["Fluriflura",7,null,"Common",750,"The Red Carpet",true,false,false,"Fluriflura"],
  ["Svinina Bombardino",10,"2025-05-31","Common",1250,"The Red Carpet",true,false,false,"Svinina Bombardino"],
  ["Talpa Di Fero",9,null,"Common",1000,"The Red Carpet",true,false,false,"Talpa Di Fero"],
  ["Pipi Kiwi",13,null,"Common",1500,"The Red Carpet",true,false,false,"Pipi Kiwi"],
  ["Pipi Corni",14,"2025-08-02","Common",1750,"Summer Fuse",true,false,false,"Pipi Corni"],
  ["Raccooni Jandelini",12,"2025-08-23","Common",1350,"Admin Abuse War",false,false,false,"Raccooni Jandelini"],
  ["Tartaragno",13,"2025-10-11","Common",1500,"Haunted Fuse",true,false,false,"Tartaragno"],
  ["Noobini Santanini",11,"2025-12-06","Common",1300,"Santa's Fuse",false,false,false,"Noobini Santanini"],
  ["Holy Arepa",14,"2026-03-07","Common",1750,"Divine Fuse",false,false,false,"Holy Arepa"],
  ["Trippi Troppi",15,null,"Rare",2000,"The Red Carpet",true,false,false,"Trippi Troppi"],
  ["Gangster Footera",30,null,"Rare",4000,"The Red Carpet",true,false,false,"Gangster Footera"],
  ["Boneca Ambalabu",40,null,"Rare",5000,"The Red Carpet",true,false,false,"Boneca Ambalabu"],
  ["Ta Ta Ta Ta Sahur",55,"2025-05-31","Rare",7500,null,null,false,false,"Ta Ta Ta Ta Sahur"],
  ["Tric Trac Baraboom",65,null,"Rare",9000,"The Red Carpet",true,false,false,"Tric Trac Baraboom"],
  ["Bandito Bobritto",35,"2025-07-05","Rare",4500,"The Red Carpet",true,false,false,"Bandito Bobritto"],
  ["Cacto Hipopotamo",50,"2025-07-12","Rare",6500,"The Red Carpet",true,false,false,"Cacto Hipopotamo"],
  ["Pipi Avocado",70,"2025-08-02","Rare",9500,"Summer Fuse",false,false,false,"Pipi Avocado"],
  ["Pinealotto Fruttarino",75,"2025-10-11","Rare",9750,"Haunted Fuse",true,false,false,"Pinealotto Fruttarino"],
  ["Cupcake Koala",60,"2025-11-08","Rare",8000,"Brainrot Trader",false,false,false,"Cupcake Koala"],
  ["Frogo Elfo",67,"2025-12-06","Rare",9250,"Santa's Fuse",false,false,false,"Frogo Elfo"],
  ["Pengolino Nuvoletto",72,"2026-03-07","Rare",9600,"Divine Fuse",false,false,false,"Pengolino Nuvoletto"],
  ["Cappuccino Assassino",75,null,"Epic",10000,"The Red Carpet",true,false,false,"Cappuccino Assassino"],
  ["Brr Brr Patapim",100,null,"Epic",15000,"The Red Carpet",true,false,false,"Brr Brr Patapim"],
  ["Trulimero Trulicina",125,null,"Epic",20000,"The Red Carpet",true,false,false,"Trulimero Trulicina"],
  ["Bananita Dolphinita",150,"2025-05-31","Epic",25000,"The Red Carpet",true,false,false,"Bananita Dolphinita"],
  ["Brri Brri Bicus Dicus Bombicus",175,null,"Epic",30000,"The Red Carpet",true,false,false,"Brri Brri Bicus Dicus Bombicus"],
  ["Bambini Crostini",135,null,"Epic",22500,"The Red Carpet",true,false,false,"Bambini Crostini"],
  ["Perochello Lemonchello",160,null,"Epic",27500,"The Red Carpet",true,false,false,"Perochello Lemonchello"],
  ["Avocadini Guffo",225,null,"Epic",35000,"The Red Carpet",true,false,false,"Avocadini Guffo"],
  ["Salamino Penguino",250,"2025-07-25","Epic",40000,"The Red Carpet",true,false,false,"Salamino Penguino"],
  ["Ti Ti Ti Sahur",225,"2025-08-02","Epic",37500,"Summer Fuse",false,false,false,"Ti Ti Ti Sahur"],
  ["Penguino Cocosino",300,"2025-08-02","Epic",45000,"Summer Fuse",false,false,false,"Penguino Cocosino"],
  ["Avocadini Antilopini",115,"2025-08-30","Epic",17500,"The Red Carpet",true,false,false,"Avocadini Antilopini"],
  ["Malame Amarele",140,"2025-09-06","Epic",23500,"First Craft Machine",false,false,false,"Malame Amarele"],
  ["Mangolini Parrocini",235,"2025-09-06","Epic",38500,"Brainrot Trader",false,false,false,"Mangolini Parrocini"],
  ["Mummio Rappitto",325,"2025-10-11","Epic",47500,"Haunted Fuse",true,false,false,"Mummio Rappitto"],
  ["Frogato Pirato",240,"2025-10-18","Epic",39000,"Witch's Fuse",false,false,false,"Frogato Pirato"],
  ["Wombo Rollo",275,"2025-11-01","Epic",42500,"The Red Carpet",true,false,false,"Wombo Rollo"],
  ["Doi Doi Do",260,"2025-11-08","Epic",41000,"Brainrot Trader",false,false,false,"Doi Doi Do"],
  ["Penguin Tree",270,"2025-12-06","Epic",42000,"Santa's Fuse",false,false,false,"Penguin Tree"],
  ["Gato Celesto",250,"2026-03-07","Epic",40000,"Divine Fuse",false,false,false,"Gato Celesto"],
  ["Burbaloni Loliloli",200,null,"Legendary",35000,"The Red Carpet",true,false,false,"Burbaloni Loliloli"],
  ["Chimpanzini Bananini",300,null,"Legendary",50000,"The Red Carpet",true,false,false,"Chimpanzini Bananini"],
  ["Ballerina Cappuccina",500,null,"Legendary",100000,"The Red Carpet",true,false,false,"Ballerina Cappuccina"],
  ["Chef Crabracadabra",600,"2025-06-07","Legendary",150000,"The Red Carpet",true,false,false,"Chef Crabracadabra"],
  ["Glorbo Fruttodrillo",750,"2025-05-31","Legendary",200000,"The Red Carpet",true,false,false,"Glorbo Fruttodrillo"],
  ["Blueberrinni Octopusini",1000,null,"Legendary",250000,"The Red Carpet",true,false,false,"Blueberrinni Octopusini"],
  ["Lionel Cactuseli",650,"2025-07-05","Legendary",175000,"The Red Carpet",true,false,false,"Lionel Cactuseli"],
  ["Pandaccini Bananini",1250,"2025-07-12","Legendary",300000,"The Red Carpet",true,false,false,"Pandaccini Bananini"],
  ["Strawberrelli Flamingelli",1150,null,"Legendary",275000,"The Red Carpet",true,false,false,"Strawberrelli Flamingelli"],
  ["Cocosini Mama",1200,"2025-08-02","Legendary",285000,"First Fuse Machine",false,false,false,"Cocosini Mama"],
  ["Pi Pi Watermelon",1300,"2025-08-02","Legendary",315000,"Summer Fuse",false,false,false,"Pi Pi Watermelon"],
  ["Sigma Boy",1350,"2025-08-01","Legendary",325000,"The Red Carpet",true,false,false,"Sigma Boy"],
  ["Pipi Potato",1100,"2025-08-23","Legendary",265000,"The Red Carpet",true,false,false,"Pipi Potato"],
  ["Quivioli Ameleonni",900,"2025-08-30","Legendary",225000,"The Red Carpet",true,false,false,"Quivioli Ameleonni"],
  ["Caramello Filtrello",1050,"2025-09-06","Legendary",255000,"First Craft Machine",false,false,false,"Caramello Filtrello"],
  ["Sigma Girl",1800,"2025-09-21","Legendary",340000,"First Craft Machine",false,false,false,"Sigma Girl"],
  ["Quackula",1275,"2025-10-11","Legendary",310000,"Haunted Fuse",true,false,false,"Quackula"],
  ["Buho de Fuego",1850,"2025-10-11","Legendary",345000,"Haunted Fuse",true,false,false,"Buho de Fuego"],
  ["Clickerino Crabo",1000,"2025-11-08","Legendary",250000,"Brainrot Trader",false,false,false,"Clickerino Crabo"],
  ["Puffaball",1500,"2025-11-22","Legendary",330000,"Fishing Event",false,false,false,"Puffaball"],
  ["Chocco Bunny",1400,"2025-12-06","Legendary",327500,"Santa's Fuse",false,false,false,"Chocco Bunny"],
  ["Sealo Regalo",1825,"2025-12-06","Legendary",342500,"Santa's Fuse",false,false,false,"Sealo Regalo"],
  ["Buho del Cielo",1350,"2026-03-07","Legendary",325000,"Divine Fuse",false,false,false,"Buho del Cielo"],
  ["Seraphino Gruyero",1900,"2026-03-07","Legendary",347500,"Divine Fuse",false,false,false,"Seraphino Gruyero"],
  ["Bandito Axolito",1225,"2025-09-06","Legendary",290000,"Cyber Craft",false,false,false,"Bandito Axolito"],
  ["Electro Quacko",1850,"2026-04-19","Legendary",345000,"Cyber Craft",false,false,false,"Electro Quacko"],
  ["Frigo Camelo",2000,null,"Mythic",350000,"The Red Carpet",true,false,false,"Frigo Camelo"],
  ["Orangutini Ananassini",2100,"2025-06-07","Mythic",400000,"The Red Carpet",true,false,false,"Orangutini Ananassini"],
  ["Bombardiro Crocodilo",2500,null,"Mythic",500000,"The Red Carpet",true,false,false,"Bombardiro Crocodilo"],
  ["Bombombini Gusini",5000,null,"Mythic",1000000,"The Red Carpet",true,false,false,"Bombombini Gusini"],
  ["Rhino Toasterino",2150,null,"Mythic",450000,null,null,false,false,"Rhino Toasterino"],
  ["Cavallo Virtuoso",7500,"2025-07-05","Mythic",2500000,"The Red Carpet",true,false,false,"Cavallo Virtuoso"],
  ["Spioniro Golubiro",3500,null,"Mythic",750000,null,null,false,false,"Spioniro Golubiro"],
  ["Zibra Zubra Zibralini",6000,null,"Mythic",1500000,null,null,false,false,"Zibra Zubra Zibralini"],
  ["Tigrilini Watermelini",6500,null,"Mythic",1750000,null,null,false,false,"Tigrilini Watermelini"],
  ["Gorillo Watermelondrillo",8000,"2025-07-25","Mythic",3000000,"The Red Carpet",true,false,false,"Gorillo Watermelondrillo"],
  ["Avocadorilla",7000,null,"Mythic",2000000,"First Fuse Machine",false,false,false,"Avocadorilla"],
  ["Ganganzelli Trulala",9000,null,"Mythic",3750000,"First Fuse Machine",false,false,true,"Ganganzelli Trulala"],
  ["Tob Tobi Tobi",8500,null,"Mythic",3250000,"First Fuse Machine",false,false,true,"Tob Tobi Tobi"],
  ["Te Te Te Sahur",9500,"2025-08-09","Mythic",4000000,"The Red Carpet",true,false,false,"Te Te Te Sahur"],
  ["Tracoducotulu Delapeladustuz",12000,"2025-08-16","Mythic",4250000,"The Red Carpet",true,false,false,"Tracoducotulu Delapeladustuz"],
  ["Lerulerulerule",8750,"2025-08-23","Mythic",3500000,"The Red Carpet",true,false,false,"Lerulerulerule"],
  ["Carloo",13500,"2025-08-23","Mythic",4500000,null,null,false,true,"Carloo"],
  ["Carrotini Brainini",15000,"2025-08-31","Mythic",4750000,null,null,false,false,"Carrotini Brainini"],
  ["Brutto Gialutto",3000,"2025-09-06","Mythic",600000,"First Craft Machine",false,false,false,"Brutto Gialutto"],
  ["Gorillo Subwoofero",68000000,"2025-09-06","Secret",17500000000,"First Craft Machine",false,false,false,"Gorillo Subwoofero"],
  ["Los Noobinis",12500,"2025-09-06","Mythic",4350000,"Cyber Craft",false,false,false,"Los Noobinis"],
  ["Rhino Helicopterino",11000,"2025-09-13","Mythic",4100000,"First Craft Machine",false,false,false,"Rhino Helicopterino"],
  ["Toiletto Focaccino",16000,"2025-09-27","Mythic",4850000,"The Red Carpet",true,false,false,"Toiletto Focaccino"],
  ["Cachorrito Melonito",13000,"2025-10-04","Mythic",4400000,"The Red Carpet",true,false,false,"Cachorrito Melonito"],
  ["Bananito Bandito",16500,"2025-10-04","Mythic",4900000,null,null,false,false,"Bananito Bandito"],
  ["Magi Ribbitini",11500,"2025-10-11","Mythic",4200000,"Haunted Fuse",true,false,false,"Magi Ribbitini"],
  ["Jacko Spaventosa",16250,"2025-10-11","Mythic",4875000,"Witch's Fuse",false,false,false,"Jacko Spaventosa"],
  ["Stoppo Luminino",8000,"2025-11-08","Mythic",3000000,"Brainrot Trader",false,false,false,"Stoppo Luminino"],
  ["Centrucci Nuclucci",15500,"2025-11-15","Mythic",4800000,"Brainrot Trader",false,false,false,"Centrucci Nuclucci"],
  ["Jingle Jingle Sahur",12250,"2025-12-06","Mythic",4300000,"Santa's Fuse",false,false,false,"Jingle Jingle Sahur"],
  ["Tree Tree Tree Sahur",17000,"2025-12-06","Mythic",4950000,"Santa's Fuse",false,false,false,"Tree Tree Tree Sahur"],
  ["Spongini Quackini",13000,"2026-01-24","Mythic",4400000,"OG Fuse",false,false,false,"Spongini Quackini"],
  ["Fizzy Soda",17250,"2026-01-24","Mythic",4975000,"OG Fuse",false,false,false,"Fizzy Soda"],
  ["Harpuccino",14000,"2026-03-07","Mythic",4650000,"Divine Fuse",false,false,false,"Harpuccino"],
  ["Berenjello Angello",18000,"2026-03-07","Mythic",5500000,"Divine Fuse",false,false,false,"Berenjello Angello"],
  ["Bee Loco",13500,"2026-04-19","Mythic",4500000,"Cyber Craft",false,false,false,"Bee Loco"],
  ["Orbi Mochi",46000000,"2026-04-19","Secret",8500000000,"Cyber Craft",false,false,false,"Orbi Mochi"],
  ["Cocoteddy",15000,"2026-05-23","Mythic",4750000,"Summer Fuse",false,false,false,"Cocoteddy"],
  ["Bucketoro",18250,"2026-05-23","Mythic",5750000,"Summer Fuse",false,false,false,"Bucketoro"],
  ["Tic Tic Ribbit",18750,"2026-08-08","Mythic",6250000,"RNG Machine",false,false,false,"Tic Tic Ribbit"],
  ["Chihuanini Taconini",45000,"2025-09-02","Brainrot God",8500000,null,null,false,true,"Chihuanini Taconini"],
  ["Cocofanto Elefanto",19000,null,"Brainrot God",6500000,"The Red Carpet",true,false,false,"Cocofanto Elefanto"],
  ["Tralalero Tralala",50000,null,"Brainrot God",10000000,"The Red Carpet",true,false,false,"Tralalero Tralala"],
  ["Odin Din Din Dun",75000,"2025-05-31","Brainrot God",15000000,null,null,false,false,"Odin Din Din Dun"],
  ["Girafa Celestre",20000,null,"Brainrot God",7500000,"The Red Carpet",true,false,false,"Girafa Celestre"],
  ["Trenostruzzo Turbo 3000",150000,null,"Brainrot God",25000000,"The Red Carpet",true,false,false,"Trenostruzzo Turbo 3000"],
  ["Matteo",50000,null,"Brainrot God",10000000,"Admin Abuse",false,false,true,"Matteo"],
  ["Tigroligre Frutonni",60000,null,"Brainrot God",14000000,null,null,false,false,"Tigroligre Frutonni"],
  ["Orcalero Orcala",100000,null,"Brainrot God",25000000,null,null,false,false,"Orcalero Orcala"],
  ["Unclito Samito",75000,"2025-07-05","Brainrot God",20000000,"Admin Abuse",false,false,true,"Unclito Samito"],
  ["Gattatino Nyanino",35000,null,"Brainrot God",7500000,"Admin Abuse",false,false,true,"Gattatino Nyanino"],
  ["Espresso Signora",70000,null,"Brainrot God",25000000,"Admin Abuse",false,false,true,"Espresso Signora"],
  ["Ballerino Lololo",200000,null,"Brainrot God",35000000,"The Red Carpet",true,false,false,"Ballerino Lololo"],
  ["Piccione Macchina",225000,"2025-07-25","Brainrot God",40000000,"The Red Carpet",true,false,false,"Piccione Macchina"],
  ["Los Crocodillitos",55000,"2025-07-25","Brainrot God",12500000,"Bombardiro Event",false,false,false,"Los Crocodillitos"],
  ["Tukanno Bananno",100000,null,"Brainrot God",22500000,"First Fuse Machine",false,false,true,"Tukanno Bananno"],
  ["Trippi Troppi Troppa Trippa",175000,"2025-08-01","Brainrot God",30000000,"The Red Carpet",true,false,false,"Trippi Troppi Troppa Trippa"],
  ["Los Tungtungtungcitos",210000,null,"Brainrot God",37500000,"First Fuse Machine",false,false,true,"Los Tungtungtungcitos"],
  ["Bulbito Bandito Traktorito",205000,"2025-08-09","Brainrot God",35000000,null,null,false,true,"Bulbito Bandito Traktorito"],
  ["Los Orcalitos",235000,"2025-08-09","Brainrot God",45000000,"First Fuse Machine",false,false,true,"Los Orcalitos"],
  ["Tipi Topi Taco",75000,"2025-08-12","Brainrot God",20000000,"Taco Event",false,false,true,"Tipi Topi Taco"],
  ["Bombardini Tortinii",225000,"2025-08-12","Brainrot God",50000000,"Taco Event",false,false,true,"Bombardini Tortinii"],
  ["Tralalita Tralala",100000,"2025-08-16","Brainrot God",20000000,"The Red Carpet",true,false,false,"Tralalita Tralala"],
  ["Urubini Flamenguini",150000,"2025-08-16","Brainrot God",30000000,"Admin Abuse",false,false,true,"Urubini Flamenguini"],
  ["Alessio",85000,"2025-08-23","Brainrot God",17500000,null,null,false,true,"Alessio"],
  ["Pakrahmatmamat",215000,"2025-08-23","Brainrot God",37500000,"The Red Carpet",true,false,false,"Pakrahmatmamat"],
  ["Los Bombinitos",220000,"2025-08-23","Brainrot God",42500000,null,null,false,true,"Los Bombinitos"],
  ["Brr es Teh Patipum",225000,null,"Brainrot God",40000000,"First Fuse Machine",false,false,true,"Brr es Teh Patipum"],
  ["Tartaruga Cisterna",250000,"2025-08-23","Brainrot God",45000000,null,null,false,false,"Tartaruga Cisterna"],
  ["Cacasito Satalito",240000,"2025-08-30","Brainrot God",45000000,"The Red Carpet",true,false,false,"Cacasito Satalito"],
  ["Mastodontico Telepiedone",275000,"2025-08-31","Brainrot God",47500000,null,null,false,false,"Mastodontico Telepiedone"],
  ["Crabbo Limonetta",235000,"2025-08-31","Brainrot God",46000000,null,null,false,true,"Crabbo Limonetta"],
  ["Gattito Tacoto",165000,"2025-09-02","Brainrot God",32500000,null,null,false,true,"Gattito Tacoto"],
  ["Los Tipi Tacos",260000,"2025-09-02","Brainrot God",46000000,null,null,false,true,"Los Tipi Tacos"],
  ["Las Capuchinas",185000,"2025-09-06","Brainrot God",32500000,"First Craft Machine",false,false,false,"Las Capuchinas"],
  ["Orcalita Orcala",240000,"2025-09-06","Brainrot God",45000000,"Cyber Craft",false,false,false,"Orcalita Orcala"],
  ["Piccionetta Macchina",270000,"2025-09-06","Brainrot God",47000000,"First Craft Machine",false,false,false,"Piccionetta Macchina"],
  ["Anpali Babel",280000,"2025-09-06","Brainrot God",48000000,null,null,false,false,"Anpali Babel"],
  ["Extinct Ballerina",125000,"2025-09-13","Brainrot God",23500000,"Extinct Event",false,false,false,"Extinct Ballerina"],
  ["Tractoro Dinosauro",230000,"2025-09-13","Brainrot God",42500000,"The Red Carpet",true,false,false,"Tractoro Dinosauro"],
  ["Belula Beluga",290000,"2025-09-13","Brainrot God",60000000,"Brainrot Trader",false,false,false,"Belula Beluga"],
  ["Capi Taco",155000,"2025-09-16","Brainrot God",31000000,"Taco Event",false,false,false,"Capi Taco"],
  ["Corn Corn Corn Sahur",250000,"2025-09-23","Brainrot God",45000000,"The Piñata",false,false,false,"Corn Corn Corn Sahur"],
  ["Brasilini Berimbini",285000,"2025-09-27","Brainrot God",55000000,"Admin Abuse",false,false,true,"Brasilini Berimbini"],
  ["Squalanana",250000,"2025-10-04","Brainrot God",45000000,"Cyber Craft",false,false,false,"Squalanana"],
  ["Pop Pop Sahur",295000,"2025-10-04","Brainrot God",65000000,null,null,false,false,"Pop Pop Sahur"],
  ["Vampira Cappucina",125000,"2025-10-11","Brainrot God",24500000,"Halloween Event",false,false,true,"Vampira Cappucina"],
  ["Jacko Jack Jack",150000,"2025-10-11","Brainrot God",30000000,"Witch's Fuse",false,false,false,"Jacko Jack Jack"],
  ["Snailenzo",250000,"2025-10-11","Brainrot God",45000000,"Witch's Fuse",false,false,false,"Snailenzo"],
  ["Tentacolo Tecnico",292500,"2025-10-11","Brainrot God",62500000,"Witch's Fuse",false,false,false,"Tentacolo Tecnico"],
  ["Pakrahmatmatina",225000,"2025-10-18","Brainrot God",40500000,"Pole Game",false,false,false,"Pakrahmatmatina"],
  ["Bambu Bambu Sahur",275000,"2025-10-18","Brainrot God",47500000,"Indonesia Event",false,false,false,"Bambu Bambu Sahur"],
  ["Krupuk Pagi Pagi",290000,"2025-10-18","Brainrot God",60000000,"Indonesia Event",false,false,false,"Krupuk Pagi Pagi"],
  ["Mummy Ambalabu",250000,"2025-10-25","Brainrot God",45000000,null,null,false,false,"Mummy Ambalabu"],
  ["Cappuccino Clownino",285000,"2025-10-25","Brainrot God",48500000,null,null,false,false,"Cappuccino Clownino"],
  ["Skull Skull Skull",290000,"2025-10-25","Brainrot God",60000000,"Halloween Event",false,false,false,"Skull Skull Skull"],
  ["Aquanaut",245000,"2025-11-01","Brainrot God",45500000,"The Red Carpet",true,false,false,"Aquanaut"],
  ["Frio Ninja",265000,"2025-11-01","Brainrot God",46500000,"Witch's Fuse",false,false,false,"Frio Ninja"],
  ["Money Money Man",65000,"2025-11-08","Brainrot God",17500000,"Brainrot Trader",false,false,false,"Money Money Man"],
  ["Noo La Polizia",280000,"2025-11-08","Brainrot God",67000000,"Brainrot Trader",false,false,false,"Noo La Polizia"],
  ["Los Chihuaninis",160000,"2025-11-18","Brainrot God",32000000,null,null,false,false,"Los Chihuaninis"],
  ["Los Gattitos",275000,"2025-11-18","Brainrot God",47500000,null,null,false,false,"Los Gattitos"],
  ["Granchiello Spiritell",260000,"2025-11-22","Brainrot God",46000000,"Fishing Event",false,false,false,"Granchiello Spiritell"],
  ["Ballerina Peppermintina",215000,"2025-11-29","Brainrot God",37500000,"Advent/Winter Hour",false,false,false,"Ballerina Peppermintina"],
  ["Ginger Globo",257500,"2025-12-06","Brainrot God",45750000,"Santa's Fuse",false,false,false,"Ginger Globo"],
  ["Ginger Cisterna",293500,"2025-12-06","Brainrot God",63500000,"Santa's Fuse",false,false,false,"Ginger Cisterna"],
  ["Yeti Claus",257500,"2025-12-06","Brainrot God",45750000,"Santa's Fuse",false,false,false,"Yeti Claus"],
  ["Buho de Noelo",267500,"2025-12-13","Brainrot God",46750000,"Santa's Fuse",false,false,false,"Buho de Noelo"],
  ["Chrismasmamat",277500,"2025-12-13","Brainrot God",47750000,null,null,false,false,"Chrismasmamat"],
  ["Cocoa Assassino",291000,"2025-12-13","Brainrot God",61000000,"Christmas Event",false,false,false,"Cocoa Assassino"],
  ["Pandanini Frostini",294000,"2025-12-13","Brainrot God",64000000,null,null,false,false,"Pandanini Frostini"],
  ["Tootini Shrimpini",260000,"2025-12-31","Brainrot God",46000000,"New Year's Event",false,false,false,"Tootini Shrimpini"],
  ["Boba Panda",270000,"2026-01-24","Brainrot God",47000000,"OG Fuse",false,false,false,"Boba Panda"],
  ["Dolphini Jetskini",294500,"2026-01-24","Brainrot God",64500000,"OG Fuse",false,false,false,"Dolphini Jetskini"],
  ["Luv Luv Luv",282500,"2026-02-07","Brainrot God",48250000,null,null,false,false,"Luv Luv Luv"],
  ["Karkerheart Luvkur",297500,"2026-02-07","Brainrot God",67500000,null,null,false,false,"Karkerheart Luvkur"],
  ["Divino Platypio",160000,"2026-03-07","Brainrot God",32000000,"Divine Fuse",false,false,false,"Divino Platypio"],
  ["Astrolero Cervalero",280000,"2026-03-07","Brainrot God",48000000,"Divine Fuse",false,false,false,"Astrolero Cervalero"],
  ["Dumborino Miracello",315000,"2026-03-07","Brainrot God",75000000,"Divine Fuse",false,false,false,"Dumborino Miracello"],
  ["Patteo",287500,"2026-03-14","Brainrot God",57500000,null,null,false,false,"Patteo"],
  ["Clovkur Kurkur",305000,"2026-03-14","Brainrot God",70000000,null,null,false,false,"Clovkur Kurkur"],
  ["Bunny Tralala",270000,"2026-04-04","Brainrot God",47000000,null,null,false,false,"Bunny Tralala"],
  ["Eggdin Egg Egg Dun",310000,"2026-04-04","Brainrot God",72500000,null,null,false,false,"Eggdin Egg Egg Dun"],
  ["Pineaplino",200000,"2026-04-11","Brainrot God",35000000,"DLC Code",false,false,true,"Pineaplino"],
  ["Lazy Ducky",255000,"2026-04-11","Brainrot God",45500000,"DLC Code",false,false,true,"Lazy Ducky"],
  ["Cola Cat",160000000,"2026-09-19","Secret",125000000000,"OG Craft",false,false,false,"Cola Cat"],
  ["Tenini Ballini",320000,"2026-07-18","Brainrot God",77000000,"DLC Code",false,false,false,"Tenini Ballini"],
  ["Appelini",300000,"2026-04-11","Brainrot God",69000000,"The Red Carpet",true,false,false,"Appelini"],
  ["Skul Skuli Skuli",300000,"2026-10-24","Brainrot God",69000000,"Dig Event",true,false,false,"Skul Skuli Skuli"],
  ["Skooter Skelly",2600000,"2026-10-24","Secret",625000000,"Dig Event",true,false,false,"Skooter Skelly"],
  ["Money Money Cat",14500000,"2026-10-24","Secret",1950000000,"Dig Event",true,false,false,"Money Money Cat"],
  ["Fang Fang Draculang",24500000,"2026-10-24","Secret",2900000000,"Dig Event",true,false,false,"Fang Fang Draculang"],
  ["Pum Pum Pum",31000000,"2026-10-24","Secret",3750000000,"Dig Event",true,false,false,"Pum Pum Pum"],
  ["Spooky Spooky Sahur",46000000,"2026-10-24","Secret",8500000000,"Dig Event",true,false,false,"Spooky Spooky Sahur"],
  ["Spooketti Tualetti",77500000,"2026-10-24","Secret",23500000000,"Dig Event",true,false,false,"Spooketti Tualetti"],
  ["Trenotubo Axolotrico 9000",255000,"2026-04-19","Brainrot God",45500000,"Cyber Craft",false,false,false,"Trenotubo Axolotrico 9000"],
  ["Pretzo Robo",52500000,"2026-04-19","Secret",11000000000,"Cyber Craft",false,false,false,"Pretzo Robo"],
  ["Lumaca Malefica",265000,"2026-05-09","Brainrot God",46500000,"Backrooms Event",false,false,false,"Lumaca Malefica"],
  ["Robo Grafito",317500,"2026-05-09","Brainrot God",76000000,"Backrooms Event",false,false,false,"Robo Grafito"],
  ["Sundrilla Sundae",180000,"2026-05-23","Brainrot God",31000000,"Summer Fuse",false,false,false,"Sundrilla Sundae"],
  ["Lemonita Splashita",280000,"2026-05-23","Brainrot God",48000000,"Summer Fuse",false,false,false,"Lemonita Splashita"],
  ["Flippo Marino",316000,"2026-05-23","Brainrot God",75500000,"Summer Fuse",false,false,false,"Flippo Marino"],
  ["Tortuginni Sandcastlini",317500,"2026-06-13","Brainrot God",76000000,null,null,false,false,"Tortuginni Sandcastlini"],
  ["Quackalena",265000,"2026-08-08","Brainrot God",46500000,"RNG Machine",false,false,false,"Quackalena"],
  ["Beavo Potto",315000,"2026-08-22","Brainrot God",75000000,"Bee Block",false,false,false,"Beavo Potto"],
  ["Koala Parabala",200000,"2026-09-12","Brainrot God",35000000,"OG Craft",false,false,false,"Koala Parabala"],
  ["Hippo Jacuzzo",282500,"2026-09-12","Brainrot God",48250000,"OG Craft",false,false,false,"Hippo Jacuzzo"],
  ["La Vacca Saturno Saturnita",325000,"2025-05-31","Secret",80000000,"The Red Carpet",true,false,false,"La Vacca Saturno Saturnita"],
  ["Los Tralaleritos",500000,"2025-06-07","Secret",100000000,"The Red Carpet",true,false,false,"Los Tralaleritos"],
  ["Graipuss Medussi",1000000,null,"Secret",250000000,"The Red Carpet",true,false,false,"Graipuss Medussi"],
  ["La Grande Combinasion",10000000,null,"Secret",1000000000,"The Red Carpet",true,false,false,"La Grande Combinasion"],
  ["Sammyni Spyderini",330000,"2025-07-05","Secret",85000000,"Admin Abuse",false,false,true,"Sammyni Spyderini"],
  ["Garama and Madundung",50000000,"2025-07-05","Secret",10000000000,"The Red Carpet",true,false,false,"Garama and Madundung"],
  ["Torrtuginni Dragonfrutini",350000,null,"Secret",125000000,null,null,false,false,"Torrtuginni Dragonfrutini"],
  ["Las Tralaleritas",650000,"2025-07-12","Secret",150000000,"The Red Carpet",true,false,false,"Las Tralaleritas"],
  ["Pot Hotspot",2500000,null,"Secret",600000000,null,null,false,false,"Pot Hotspot"],
  ["Nuclearo Dinossauro",15000000,null,"Secret",2500000000,"The Red Carpet",true,false,false,"Nuclearo Dinossauro"],
  ["Las Vaquitas Saturnitas",750000,"2025-07-25","Secret",200000000,"La Vacca Ritual",false,false,false,"Las Vaquitas Saturnitas"],
  ["Chicleteira Bicicleteira",3500000,"2025-07-25","Secret",750000000,"The Red Carpet",true,false,false,"Chicleteira Bicicleteira"],
  ["Agarrini la Palini",425000,null,"Secret",80000000,"First Fuse Machine",false,false,true,"Agarrini la Palini"],
  ["Los Combinasionas",15000000,"2025-08-02","Secret",2000000000,"First Fuse Machine",false,false,true,"Los Combinasionas"],
  ["Karkerkar Kurkur",325000,"2025-08-09","Secret",80000000,"Admin Abuse",false,false,true,"Karkerkar Kurkur"],
  ["Dragon Cannelloni",250000000,"2025-08-01","Secret",250000000000,"The Red Carpet",true,false,false,"Dragon Cannelloni"],
  ["Los Hotspotsitos",20000000,null,"Secret",3000000000,"First Fuse Machine",false,false,true,"Los Hotspotsitos"],
  ["Esok Sekolah",30000000,"2025-08-09","Secret",3500000000,null,null,false,true,"Esok Sekolah"],
  ["Nooo My Hotspot",1500000,"2025-08-12","Secret",500000000,"Taco Event",false,false,true,"Nooo My Hotspot"],
  ["Los Matteos",325000,"2025-08-16","Secret",80000000,"Matteo Ritual",false,false,true,"Los Matteos"],
  ["Job Job Job Sahur",700000,"2025-08-16","Secret",175000000,"The Red Carpet",true,false,false,"Job Job Job Sahur"],
  ["Dul Dul Dul",375000,"2025-08-23","Secret",150000000,"Admin Abuse",false,false,true,"Dul Dul Dul"],
  ["Blackhole Goat",400000,"2025-08-23","Secret",75000000,null,null,false,true,"Blackhole Goat"],
  ["Los Spyderinis",425000,"2025-08-23","Secret",125000000,"Spyderini Ritual",false,false,true,"Los Spyderinis"],
  ["Ketupat Kepat",35000000,"2025-08-23","Secret",5000000000,"The Red Carpet",true,false,false,"Ketupat Kepat"],
  ["La Supreme Combinasion",200000000,null,"Secret",200000000000,"First Fuse Machine",false,false,true,"La Supreme Combinasion"],
  ["Bisonte Giuppitere",325000,"2025-08-23","Secret",80000000,null,null,false,true,"Bisonte Giuppitere"],
  ["Guerriro Digitale",550000,"2025-08-31","Secret",120000000,null,null,false,true,"Guerriro Digitale"],
  ["Ketchuru and Musturu",42500000,"2025-08-30","Secret",7500000000,"The Red Carpet",true,false,false,"Ketchuru and Musturu"],
  ["Spaghetti Tualetti",60000000,"2025-08-30","Secret",15000000000,null,null,false,false,"Spaghetti Tualetti"],
  ["Los Nooo My Hotspotsitos",5500000,"2025-09-02","Secret",1000000000,null,null,false,true,"Los Nooo My Hotspotsitos"],
  ["Trenostruzzo Turbo 4000",335000,"2025-09-06","Secret",90000000,"First Craft Machine",false,false,false,"Trenostruzzo Turbo 4000"],
  ["Fragola La La La",32500000,"2025-09-06","Secret",4250000000,"First Craft Machine",false,false,false,"Fragola La La La"],
  ["La Sahur Combinasion",2000000,"2025-09-06","Secret",550000000,"First Craft Machine",false,false,false,"La Sahur Combinasion"],
  ["La Karkerkar Combinasion",600000,"2025-09-06","Secret",160000000,"First Craft Machine",false,false,true,"La Karkerkar Combinasion"],
  ["Tralaledon",27500000,"2025-09-06","Secret",3000000000,"First Craft Machine",false,false,false,"Tralaledon"],
  ["Los Bros",24000000,"2025-09-06","Secret",2600000000,"First Craft Machine",false,false,false,"Los Bros"],
  ["Los Chicleteiras",7000000,"2025-09-14","Secret",1200000000,"Chicleteira Ritual",false,false,false,"Los Chicleteiras"],
  ["Chachechi",400000,"2025-09-13","Secret",85000000,"Admin Abuse",false,false,false,"Chachechi"],
  ["Extinct Tralalero",450000,"2025-09-13","Secret",125000000,"Extinct Event",false,false,false,"Extinct Tralalero"],
  ["Extinct Matteo",625000,"2025-09-13","Secret",162500000,"Extinct Event",false,false,false,"Extinct Matteo"],
  ["Las Sis",17500000,"2025-09-13","Secret",2500000000,"First Craft Machine",false,false,false,"Las Sis"],
  ["Celularcini Viciosini",22500000,"2025-09-13","Secret",2750000000,"First Craft Machine",false,false,false,"Celularcini Viciosini"],
  ["La Extinct Grande",23500000,"2025-09-13","Secret",3250000000,"Extinct Event",false,false,true,"La Extinct Grande"],
  ["Quesadilla Crocodila",3000000,"2025-09-16","Secret",700000000,null,null,false,false,"Quesadilla Crocodila"],
  ["Tacorita Bicicleta",16500000,"2025-09-16","Secret",2250000000,"Taco Event",false,false,false,"Tacorita Bicicleta"],
  ["La Cucaracha",475000,"2025-09-21","Secret",110000000,"Admin Abuse",false,false,true,"La Cucaracha"],
  ["To to to Sahur",2250000,"2025-09-21","Secret",575000000,"The Red Carpet",true,false,false,"To to to Sahur"],
  ["Mariachi Corazoni",12500000,"2025-09-21","Secret",1750000000,"The Piñata",false,false,true,"Mariachi Corazoni"],
  ["Los Tacoritas",32000000,"2025-09-21","Secret",4000000000,"First Craft Machine",false,false,false,"Los Tacoritas"],
  ["Tictac Sahur",37500000,"2025-09-21","Secret",6000000000,"The Red Carpet",true,false,false,"Tictac Sahur"],
  ["Yess my examine",575000,"2025-09-27","Secret",130000000,"Dul Dul Ritual",false,false,false,"Yess my Examen"],
  ["Karker Sahur",725000,"2025-09-27","Secret",185000000,"First Craft Machine",false,false,false,"Karker Sahur"],
  ["Noo my examine",32500000,"2025-09-27","Secret",4250000000,"Dul Dul Ritual",false,false,true,"Noo my Examen"],
  ["Money Money Puggy",21000000,"2025-09-27","Secret",2600000000,"The Red Carpet",true,false,false,"Money Money Puggy"],
  ["Los Primos",31000000,"2025-09-27","Secret",3750000000,"First Craft Machine",false,false,false,"Los Primos"],
  ["Tang Tang Keletang",33500000,"2025-09-27","Secret",4500000000,"The Red Carpet",true,false,true,"Tang Tang Keletang"],
  ["Perrito Burrito",1000000,"2025-09-30","Secret",250000000,"Limited Quantity Craft",false,false,true,"Perrito Burrito"],
  ["Chillin Chili",25000000,"2025-09-30","Secret",2500000000,"Limited Quantity Craft",false,false,true,"Chillin Chili"],
  ["Los Tortus",500000,"2025-10-04","Secret",100000000,null,null,false,false,"Los Tortus"],
  ["Los Karkeritos",750000,"2025-10-04","Secret",200000000,"Karker Ritual",false,false,false,"Los Karkeritos"],
  ["Los Jobcitos",1500000,"2025-10-04","Secret",500000000,null,null,false,false,"Los Jobcitos"],
  ["Los 67",13500000,"2025-10-04","Secret",1850000000,null,null,false,false,"Los 67"],
  ["La Secret Combinasion",95000000,"2025-10-04","Secret",35000000000,null,null,false,false,"La Secret Combinasion"],
  ["Burguro And Fryuro",150000000,"2025-10-04","Secret",75000000000,null,null,false,false,"Burguro And Fryuro"],
  ["Zombie Tralala",500000,"2025-10-11","Secret",100000000,"Halloween Event",false,false,true,"Zombie Tralala"],
  ["Vulturino Skeletono",500000,"2025-10-11","Secret",110000000,"Witch's Fuse",false,false,false,"Vulturino Skeletono"],
  ["Frankentteo",700000,"2025-10-11","Secret",175000000,"Halloween Event",false,false,true,"Frankentteo"],
  ["La Vacca Jacko Linterino",850000,"2025-10-11","Secret",225000000,"Halloween Event",false,false,true,"La Vacca Jacko Linterino"],
  ["Chicleteirina Bicicleteirina",4000000,"2025-10-11","Secret",850000000,"The Red Carpet",true,false,false,"Chicleteirina Bicicleteirina"],
  ["Eviledon",31500000,"2025-10-11","Secret",3850000000,"Witch's Fuse",false,false,false,"Eviledon"],
  ["La Spooky Grande",24500000,"2025-10-11","Secret",2900000000,"Limited Quantity Craft",false,false,true,"La Spooky Grande"],
  ["Los Mobilis",8500000,"2025-10-11","Secret",1400000000,"Witch's Fuse",false,false,false,"Los Mobilis"],
  ["Spooky and Pumpky",80000000,"2025-10-11","Secret",25000000000,"Witch's Fuse",false,false,false,"Spooky and Pumpky"],
  ["Boatito Auratito",525000,"2025-10-18","Secret",115000000,"Admin Abuse",false,false,true,"Boatito Auratito"],
  ["Horegini Boom",2750000,"2025-10-18","Secret",650000000,"Aura Boat",false,false,false,"Horegini Boom"],
  ["Rang Ring Bus",6000000,"2025-10-18","Secret",1100000000,"Pole Game",false,false,false,"Rang Ring Bus"],
  ["Mieteteira Bicicleteira",26000000,"2025-10-18","Secret",2750000000,"Witch's Fuse",false,false,false,"Mieteteira Bicicleteira"],
  ["Quesadillo Vampiro",3500000,"2025-10-21","Secret",750000000,"Limited Quantity Craft",false,false,false,"Quesadillo Vampiro"],
  ["Burrito Bandito",4000000,"2025-10-21","Secret",850000000,null,null,false,false,"Burrito Bandito"],
  ["Chipso and Queso",25000000,"2025-10-21","Secret",2500000000,"Limited Quantity Craft",false,false,false,"Chipso and Queso"],
  ["Jackorilla",315000,"2025-10-25","Secret",80000000,null,null,false,false,"Jackorilla"],
  ["Pumpkini Spyderini",650000,"2025-10-25","Secret",165000000,null,null,false,false,"Pumpkini Spyderini"],
  ["Trickolino",900000,"2025-10-25","Secret",235000000,null,null,false,false,"Trickolino"],
  ["Telemorte",2000000,"2025-10-25","Secret",550000000,null,null,false,false,"Telemorte"],
  ["Pot Pumpkin",3000000,"2025-10-25","Secret",700000000,"Halloween Event",false,false,false,"Pot Pumpkin"],
  ["Noo my Candy",5000000,"2025-10-25","Secret",900000000,"Trick Or Treat",false,false,false,"Noo my Candy"],
  ["Los Spooky Combinasionas",20000000,"2025-10-25","Secret",3000000000,null,null,false,false,"Los Spooky Combinasionas"],
  ["La Casa Boo",100000000,"2025-10-25","Secret",40000000000,null,null,false,false,"La Casa Boo"],
  ["La Taco Combinasion",35000000,"2025-10-28","Secret",5000000000,"Limited Quantity Craft",false,false,false,"La Taco Combinasion"],
  ["1x1x1x1",1111111,"2025-11-01","Secret",255555555,"Cave Ritual",false,false,false,"1x1x1x1"],
  ["John Doe",7500000,"2026-04-25","Secret",1250000000,"Cave Ritual",false,false,false,"John Doe"],
  ["Capitano Moby",160000000,"2025-11-01","Secret",125000000000,"The Red Carpet",true,false,false,"Capitano Moby"],
  ["Guest 666",66666666,"2025-11-01","Secret",15666666666,"Cave Ritual",false,false,false,"Guest 666"],
  ["Pirulitoita Bicicleteira",2500000,"2025-11-08","Secret",600000000,"Brainrot Trader",false,false,false,"Pirulitoita Bicicleteira"],
  ["Los Puggies",40000000,"2025-11-08","Secret",7000000000,"Brainrot Trader",false,false,false,"Los Puggies"],
  ["Los Spaghettis",70000000,"2025-11-08","Secret",20000000000,"Brainrot Trader",false,false,false,"Los Spaghettis"],
  ["Fragrama and Chocrama",100000000,"2025-11-08","Secret",40000000000,"Brainrot Trader",false,false,false,"Fragrama and Chocrama"],
  ["Swag Soda",13000000,"2025-11-15","Secret",1800000000,"Brainrot Trader",false,false,false,"Swag Soda"],
  ["Orcaledon",40000000,"2025-11-15","Secret",7000000000,"Brainrot Trader",false,false,false,"Orcaledon"],
  ["Los Cucarachas",1250000,"2025-11-18","Secret",300000000,null,null,false,false,"Los Cucarachas"],
  ["Los Burritos",8500000,"2025-11-18","Secret",1400000000,null,null,false,false,"Los Burritos"],
  ["Los Quesadillas",4500000,"2025-11-18","Secret",875000000,null,null,false,false,"Los Quesadillas"],
  ["Cuadramat and Pakrahmatmamat",1400000,"2025-11-22","Secret",400000000,"Brainrot Trader",false,false,false,"Cuadramat and Pakrahmatmamat"],
  ["Fishino Clownino",120000000,"2025-11-22","Secret",48500000000,"Fishing Event",false,false,false,"Fishino Clownino"],
  ["Los Planitos",18500000,"2025-11-22","Secret",2750000000,"Brainrot Trader",false,false,false,"Los Planitos"],
  ["W or L",30000000,"2025-11-22","Secret",3000000000,"Limited Quantity Craft",false,false,false,"W or L"],
  ["Lavadorito Spinito",45000000,"2025-11-22","Secret",8000000000,"The Red Carpet",true,false,false,"Lavadorito Spinito"],
  ["Gobblino Uniciclino",27500000,"2025-11-25","Secret",2850000000,"Thanksgiving Event",false,false,false,"Gobblino Uniciclino"],
  ["Giftini Spyderini",999999,"2025-11-29","Secret",240000000,null,null,false,false,"Giftini Spyderini"],
  ["Cooki and Milki",155000000,"2025-12-06","Secret",100000000000,"Santa's Fuse",false,false,false,"Cooki and Milki"],
  ["Skelly and Coffy",155000000,"2026-10-17","Secret",100000000000,"Skeleton Event",true,false,false,"Skelly and Coffy"],
  ["25",2500000,"2025-11-29","Secret",600000000,"Advent Calendar",false,false,false,"25"],
  ["La Vacca Prese Presente",600000,"2025-12-06","Secret",160000000,"Santa's Fuse",false,false,false,"La Vacca Prese Presente"],
  ["Reindeer Tralala",600000,"2025-12-06","Secret",160000000,"Christmas Event",false,false,false,"Reindeer Tralala"],
  ["Santteo",800000,"2025-12-06","Secret",210000000,"Christmas Event",false,false,false,"Santteo"],
  ["Please my Present",1300000,"2025-12-06","Secret",350000000,"Advent Calendar",false,false,false,"Please my Present"],
  ["List List List Sahur",2000000,"2025-12-06","Secret",550000000,"Christmas Event",false,false,false,"List List List Sahur"],
  ["Ho Ho Ho Sahur",3250000,"2025-12-06","Secret",725000000,"Santa's Fuse",false,false,false,"Ho Ho Ho Sahur"],
  ["Chicleteira Noelteira",15000000,"2025-12-06","Secret",2000000000,"Santa's Fuse",false,false,false,"Chicleteira Noelteira"],
  ["La Jolly Grande",30000000,"2025-12-06","Secret",3500000000,"Christmas Wheel Spin",false,false,false,"La Jolly Grande"],
  ["Los Candies",23000000,"2025-12-13","Secret",3000000000,"Santa's Fuse",false,false,false,"Los Candies"],
  ["Triplito Tralaleritos",875000,"2025-12-13","Secret",230000000,null,null,false,false,"Triplito Tralaleritos"],
  ["Santa Hotspot",2600000,"2025-12-13","Secret",625000000,null,null,false,false,"Santa Hotspot"],
  ["La Ginger Sekolah",75000000,"2025-12-13","Secret",23000000000,null,null,false,false,"La Ginger Sekolah"],
  ["Reinito Sleighito",140000000,"2025-12-13","Secret",60000000000,null,null,false,false,"Reinito Sleighito"],
  ["Naughty Naughty",3000000,"2025-12-13","Secret",700000000,"Christmas Event",false,false,false,"Naughty Naughty"],
  ["Noo my Present",6000000,"2025-12-13","Secret",1100000000,"Christmas Event",false,false,false,"Noo my Present"],
  ["Los 25",10000000,"2025-12-13","Secret",1500000000,null,null,false,false,"Los 25"],
  ["Chimnino",14000000,"2025-12-13","Secret",1900000000,null,null,false,false,"Chimnino"],
  ["Festive 67",67000000,"2025-12-13","Secret",16000000000,"DLC Code",false,false,true,"Festive 67"],
  ["Swaggy Bros",40000000,"2025-12-16","Secret",7000000000,"Limited Quantity Craft",false,false,false,"Swaggy Bros"],
  ["Bunnyman",1500000,"2025-12-20","Secret",500000000,"Advent Calendar",false,false,false,"Bunnyman"],
  ["Dragon Gingerini",350000000,"2025-12-20","Secret",350000000000,"Santa's Fuse",false,false,false,"Dragon Gingerini"],
  ["Donkeyturbo Express",7500000,"2025-12-20","Secret",1250000000,"Christmas Event",false,false,false,"Donkeyturbo Express"],
  ["Money Money Reindeer",25000000,"2025-12-24","Secret",2500000000,"Santa's Market",false,false,false,"Money Money Reindeer"],
  ["Los Jolly Combinasionas",20000000,"2025-12-24","Secret",3000000000,"Santa's Market",false,false,false,"Los Jolly Combinasionas"],
  ["Jolly Jolly Sahur",45000000,"2025-12-24","Secret",8000000000,"Santa's Market",false,false,false,"Jolly Jolly Sahur"],
  ["Ginger Gerat",75000000,"2025-12-24","Secret",22500000000,"Santa's Market",false,false,false,"Ginger Gerat"],
  ["Rocco Disco",650000,"2025-12-31","Secret",150000000,"New Year's Event",false,false,false,"Rocco Disco"],
  ["Bunito Bunito Spinito",3000000,"2025-12-31","Secret",700000000,"New Year's Event",false,false,false,"Bunito Bunito Spinito"],
  ["Tuff Toucan",26000000,"2025-12-31","Secret",2750000000,"New Year's Event",false,false,false,"Tuff Toucan"],
  ["Cerberus",175000000,"2026-01-10","Secret",150000000000,"The Red Carpet",true,false,false,"Cerberus"],
  ["Medusini and Demonini",180000000,"2026-10-17","Secret",165000000000,"Haunted Fuse",true,false,false,"Medusini and Demonini"],
  ["GOAT",950000,"2026-01-17","Secret",237500000,"Admin Abuse",false,false,false,"GOAT"],
  ["Brunito Marsito",3500000,"2026-01-17","Secret",750000000,null,null,false,false,"Brunito Marsito"],
  ["Los Trios",700000,"2026-01-24","Secret",175000000,"OG Fuse",false,false,false,"Los Trios"],
  ["Chill Puppy",4000000,"2026-01-24","Secret",850000000,"OG Fuse",false,false,false,"Chill Puppy"],
  ["Arcadopus",5000000,"2026-01-24","Secret",900000000,"Tsunami LTM",false,false,false,"Arcadopus"],
  ["Spinny Hammy",17000000,"2026-01-24","Secret",2300000000,"OG Fuse",false,false,false,"Spinny Hammy"],
  ["Bacuru and Egguru",16000000,"2026-01-24","Secret",2100000000,"OG Fuse",false,false,false,"Bacuru and Egguru"],
  ["Ketupat Bros",145000000,"2026-01-24","Secret",65000000000,"OG Fuse",false,false,false,"Ketupat Bros"],
  ["Hydra Dragon Cannelloni",300000000,"2026-01-24","Secret",300000000000,"OG Fuse",false,false,false,"Hydra Dragon Cannelloni"],
  ["Mi Gatito",3250000,"2026-01-31","Secret",725000000,"Admin Abuse",false,false,false,"Mi Gatito"],
  ["Los Mi Gatitos",6500000,"2026-01-31","Secret",1150000000,"Mi Gatito Ritual",false,false,false,"Los Mi Gatitos"],
  ["Popcuru and Fizzuru",115000000,"2026-01-31","Secret",48500000000,"OG Fuse",false,false,false,"Popcuru and Fizzuru"],
  ["Love Love Love Sahur",1000000,"2026-02-07","Secret",250000000,null,null,false,false,"Love Love Love Sahur"],
  ["Cupid Cupid Sahur",3100000,"2026-02-07","Secret",715000000,"Cupid's Machine",false,false,false,"Cupid Cupid Sahur"],
  ["Cupid Hotspot",3500000,"2026-02-07","Secret",750000000,null,null,false,false,"Cupid Hotspot"],
  ["Noo my Heart",13000000,"2026-02-07","Secret",1800000000,null,null,false,false,"Noo my Heart"],
  ["Chicleteira Cupideira",17500000,"2026-02-07","Secret",2500000000,null,null,false,false,"Chicleteira Cupideira"],
  ["Lovin Rose",32500000,"2026-02-07","Secret",4250000000,"Cupid's Machine",false,false,false,"Lovin Rose"],
  ["La Romantic Grande",40000000,"2026-02-07","Secret",7000000000,"Limited Quantity Craft",false,false,false,"La Romantic Grande"],
  ["Rosetti Tualetti",50000000,"2026-02-07","Secret",10000000000,null,null,false,false,"Rosetti Tualetti"],
  ["Love Love Bear",225000000,"2026-02-07","Secret",225000000000,"Cupid's Machine",false,false,false,"Love Love Bear"],
  ["Arca Bros",250000000,"2026-10-17","Secret",250000000000,"DLC Code",false,false,false,"Arca Bros"],
  ["Rosey and Teddy",165000000,"2026-02-07","Secret",130000000000,null,null,false,false,"Rosey and Teddy"],
  ["Los Sweethearts",16500000,"2026-02-14","Secret",2250000000,"First Fuse Machine",false,false,false,"Los Sweethearts"],
  ["Sammyni Fattini",70000000,"2026-02-21","Secret",20000000000,null,null,false,false,"Sammyni Fattini"],
  ["La Food Combinasion",90000000,"2026-02-21","Secret",30000000000,null,null,false,false,"La Food Combinasion"],
  ["Los Sekolahs",110000000,"2026-02-21","Secret",45000000000,null,null,false,false,"Los Sekolahs"],
  ["Los Amigos",130000000,"2026-02-21","Secret",55000000000,null,null,false,false,"Los Amigos"],
  ["Tirilikalika Tirilikalako",82500000,"2025-09-06","Secret",25250000000,"First Craft Machine",false,false,false,"Tirilikalika Tirilikalako"],
  ["Antonio",125000000,"2025-09-06","Secret",50000000000,"First Craft Machine",false,false,false,"Antonio"],
  ["Elefanto Frigo",185000000,"2025-09-21","Secret",175000000000,"First Craft Machine",false,false,false,"Elefanto Frigo"],
  ["Signore Carapace",275000000,"2025-09-06","Secret",275000000000,"First Craft Machine",false,false,false,"Signore Carapace"],
  ["Fishboard",825000,"2026-02-28","Secret",215000000,"The Red Carpet",true,false,false,"Fishboard"],
  ["DJ Panda",17500000,"2026-02-28","Secret",2500000000,"The Red Carpet",true,false,false,"DJ Panda"],
  ["Ventoliero Pavonero",65000000,"2026-02-28","Secret",15500000000,"The Red Carpet",true,false,false,"Ventoliero Pavonero"],
  ["Celestial Pegasus",175000000,"2026-02-28","Secret",150000000000,null,null,false,false,"Celestial Pegasus"],
  ["Tacorillo Crocodillo",12500000,"2026-03-03","Secret",1500000000,"Limited Quantity Craft",false,false,false,"Tacorillo Crocodillo"],
  ["Nacho Spyder",50000000,"2026-03-03","Secret",10000000000,"Limited Quantity Craft",false,false,false,"Nacho Spyder"],
  ["Paradiso Axolottino",900000,"2026-03-07","Secret",235000000,"Divine Fuse",false,false,false,"Paradiso Axolottino"],
  ["Serafinna Medusella",5500000,"2026-03-07","Secret",1000000000,"Divine Fuse",false,false,false,"Serafinna Medusella"],
  ["Cigno Fulgoro",20000000,"2026-03-07","Secret",3000000000,"Divine Fuse",false,false,false,"Cigno Fulgoro"],
  ["Los Cupids",30000000,"2026-03-07","Secret",3500000000,"Divine Fuse",false,false,false,"Los Cupids"],
  ["Griffin",400000000,"2026-03-07","Secret",400000000000,"Divine Fuse",false,false,false,"Griffin"],
  ["La Vacca Lepre Lepreino",1100000,"2026-03-14","Secret",255000000,null,null,false,false,"La Vacca Lepre Lepreino"],
  ["Luck Luck Luck Sahur",3750000,"2026-03-14","Secret",800000000,null,null,false,false,"Luck Luck Luck Sahur"],
  ["Noo my Gold",13500000,"2026-03-14","Secret",1850000000,null,null,false,false,"Noo my Gold"],
  ["Snailo Clovero",18500000,"2026-03-14","Secret",2750000000,null,null,false,false,"Snailo Clovero"],
  ["Gold Gold Gold",45000000,"2026-03-14","Secret",8000000000,null,null,false,false,"Gold Gold Gold"],
  ["Fortunu and Cashuru",130000000,"2026-03-14","Secret",55000000000,null,null,false,false,"Fortunu and Cashuru"],
  ["Cloverat Clapat",60000000,"2026-03-14","Secret",15000000000,"St Patricks Event",false,false,false,"Cloverat Clapat"],
  ["Dug dug dug",35000000,"2025-09-21","Secret",5000000000,"First Craft Machine",false,false,false,"Dug dug dug"],
  ["La Lucky Grande",40000000,"2026-03-17","Secret",7000000000,"Limited Quantity Craft",false,false,false,"La Lucky Grande"],
  ["Eid Eid Eid Sahur",3500000,"2026-03-21","Secret",750000000,"Eid Event",false,false,false,"Eid Eid Eid Sahur"],
  ["Granny",4000000,"2026-03-21","Secret",850000000,"Granny's Funeral Event",false,false,false,"Granny"],
  ["Foxini Lanternini",115000000,"2026-03-21","Secret",47500000000,"Eid Event",false,false,false,"Foxini Lanternini"],
  ["Buntteo",850000,"2026-03-28","Secret",225000000,"Easter Event",false,false,false,"Buntteo"],
  ["Bunny Bunny Bunny Sahur",2250000,"2026-03-28","Secret",575000000,"Easter Event",false,false,false,"Bunny Bunny Bunny Sahur"],
  ["Noo my Eggs",7000000,"2026-03-28","Secret",1200000000,"Easter Event",false,false,false,"Noo my Eggs"],
  ["La Easter Grande",55000000,"2026-03-31","Secret",12500000000,"Limited Quantity Craft",false,false,false,"La Easter Grande"],
  ["Easter Easter Easter Sahur",1250000,"2026-04-04","Secret",300000000,null,null,false,false,"Easter Easter Easter Sahur"],
  ["Los Bunitos",4250000,"2026-04-04","Secret",865000000,null,null,false,false,"Los Bunitos"],
  ["Baskito",16000000,"2026-04-04","Secret",2100000000,null,null,false,false,"Baskito"],
  ["Churrito Bunnito",21000000,"2026-04-04","Secret",2600000000,null,null,false,false,"Churrito Bunnito"],
  ["Quackini Snackini",65000000,"2026-04-04","Secret",15500000000,"Egg Town Event",false,false,false,"Quackini Snackini"],
  ["Hopilikalika Hopilikalako",55000000,"2026-04-04","Secret",12500000000,null,null,false,false,"Hopilikalika Hopilikalako"],
  ["Boppin Bunny",80000000,"2026-04-04","Secret",25000000000,"DLC Code",false,false,true,"Boppin Bunny"],
  ["Hydra Bunny",185000000,"2026-04-04","Secret",175000000000,null,null,false,false,"Hydra Bunny"],
  ["Bunny and Eggy",170000000,"2026-04-04","Secret",135000000000,"Divine Fuse",false,false,false,"Bunny and Eggy"],
  ["Globa Steppa",27500000,"2026-04-11","Secret",3000000000,"DLC Code",false,false,true,"Globa Steppa"],
  ["Rico Dinero",42500000,"2026-04-11","Secret",7500000000,"DLC Code",false,false,true,"Rico Dinero"],
  ["Pancake and Syrup",125000000,"2026-04-11","Secret",50000000000,"DLC Code",false,false,true,"Pancake and Syrup"],
  ["Arcadragon",215000000,"2026-04-11","Secret",215000000000,"DLC Code",false,false,true,"Arcadragon"],
  ["Berryno",1500000,"2026-04-11","Secret",500000000,"The Red Carpet",true,false,false,"Berryno"],
  ["Strawberrita",6500000,"2026-04-11","Secret",1150000000,null,null,false,false,"Strawberrita"],
  ["Bananito",15000000,"2026-04-11","Secret",2000000000,"The Red Carpet",true,false,false,"Bananito"],
  ["Cash or Card",100000000,"2026-04-11","Secret",40000000000,"The Red Carpet",true,false,false,"Cash or Card"],
  ["Los Mariachis",30000000,null,"Secret",3000000000,"The Piñata",false,false,false,"Los Mariachis"],
  ["Buho de Volto",2750000,"2026-04-19","Secret",650000000,"Cyber Craft",false,false,false,"Buho de Volto"],
  ["Futbolini Skatini",4500000,"2026-04-25","Secret",875000000,"Cyber Craft",false,false,false,"Futbolini Skatini"],
  ["Camera Ramena",17000000,"2026-04-19","Secret",2300000000,"Cyber Craft",false,false,false,"Camera Ramena"],
  ["Gym Bros",42500000,"2026-04-19","Secret",7500000000,"Cyber Craft",false,false,false,"Gym Bros"],
  ["Money Money Bros",47000000,"2026-04-25","Secret",9000000000,"Cyber Craft",false,false,false,"Money Money Bros"],
  ["Los Chillis",75000000,"2026-04-19","Secret",22500000000,"Cyber Craft",false,false,false,"Los Chillis"],
  ["Los Hackers",75000000,"2026-04-25","Secret",22500000000,"Cyber Craft",false,false,false,"Los Hackers"],
  ["Duggy Bros",90000000,"2026-04-25","Secret",30000000000,"Cyber Craft",false,false,false,"Duggy Bros"],
  ["Kalika Bros",190000000,"2026-04-19","Secret",185000000000,"Cyber Craft",false,false,false,"Kalika Bros"],
  ["Digi Narwhal",200000000,"2026-04-19","Secret",200000000000,"Cyber Craft",false,false,false,"Digi Narwhal"],
  ["Flancito",3750000,"2026-05-16","Secret",800000000,"SAB's Anniversary Event",false,false,false,"Flancito"],
  ["La Anniversary Grande",50000000,"2026-05-16","Secret",10000000000,"Limited Quantity Craft",false,false,false,"La Anniversary Grande"],
  ["Sammyni Cakini",85000000,"2026-05-16","Secret",25500000000,"SAB's Anniversary Event",false,false,false,"Sammyni Cakini"],
  ["Jelly Moby",175000000,"2026-05-16","Secret",150000000000,"SAB's Anniversary Event",false,false,false,"Jelly Moby"],
  ["Hippo Golazo",1250000,"2026-06-27","Secret",300000000,"Soccer Board",false,false,false,"Hippo Golazo"],
  ["Ref Ref Ref Sahur",2750000,"2026-06-27","Secret",650000000,"Soccer Board",false,false,false,"Ref Ref Ref Sahur"],
  ["Esok Goala",32500000,"2026-06-27","Secret",4250000000,"Soccer Board",false,false,false,"Esok Goala"],
  ["Los Admins",95000000,"2026-07-11","Secret",35000000000,"Los Traders",false,false,false,"Los Admins"],
  ["Los Tictacs",60000000,"2026-07-11","Secret",15000000000,"Los Traders",false,false,false,"Los Tictacs"],
  ["Moby Bros",225000000,"2026-07-11","Secret",225000000000,"Los Traders",false,false,false,"Moby Bros"],
  ["Los Tangcitos",42500000,"2026-07-11","Secret",7500000000,"Los Traders",false,false,false,"Los Tangcitos"],
  ["Los Sigmas",2300000,"2026-07-11","Secret",580000000,"Los Traders",false,false,false,"Los Sigmas"],
  ["Los Cornis",3100000,"2026-07-11","Secret",715000000,"Los Traders",false,false,false,"Los Cornis"],
  ["Eggdin Egg Egg Dun Egg",0,null,"Easter",72500000,null,null,true,false,"Eggdin Egg Egg Dun Egg"],
  ["Bunny Tralala Egg",0,null,"Easter",47000000,null,null,true,false,"Bunny Tralala Egg"],
  ["Easter Easter Easter Sahur Egg",0,null,"Easter",300000000,null,null,true,false,"Easter Easter Easter Sahur Egg"],
  ["Noo my Eggs Egg",0,null,"Easter",1200000000,null,null,true,false,"Noo my Eggs Egg"],
  ["Buntteo Egg",0,null,"Easter",225000000,null,null,true,false,"Buntteo Egg"],
  ["Hopilikalika Hopilikalako Egg",0,null,"Easter",12500000000,null,null,true,false,"Hopilikalika Hopilikalako Egg"],
  ["Los Bunitos Egg",0,null,"Easter",865000000,null,null,true,false,"Los Bunitos Egg"],
  ["Hydra Bunny Egg",0,null,"Easter",175000000000,null,null,true,false,"Hydra Bunny Egg"],
  ["Baskito Egg",0,null,"Easter",2100000000,null,null,true,false,"Baskito Egg"],
  ["Quackini Snackini Egg",0,null,"Easter",15500000000,null,null,true,false,"Quackini Snackini Egg"],
  ["Churrito Bunnito Egg",0,null,"Easter",2600000000,null,null,true,false,"Churrito Bunnito Egg"],
  ["Bunny Bunny Bunny Sahur Egg",0,null,"Easter",575000000,null,null,true,false,"Bunny Bunny Bunny Sahur Egg"],
  ["Glaciator",2300000,"2026-05-09","Secret",580000000,"Backrooms Event",false,false,false,"Glaciator"],
  ["Flipa Sandala",6000000,"2026-05-09","Secret",1100000000,"Backrooms Event",false,false,false,"Flipa Sandala"],
  ["Abyssaloco",33333333,"2026-05-09","Secret",4333333333,"Backrooms Event",false,false,false,"Abyssaloco"],
  ["Rubrikiko",70000000,"2026-05-09","Secret",20000000000,"Backrooms Event",false,false,false,"Rubrikiko"],
  ["Bombardiro Vaccariro",1000000,"2026-05-23","Secret",250000000,"Summer Fuse",false,false,false,"Bombardiro Vaccariro"],
  ["Ombrello Topolino",6500000,"2026-05-23","Secret",1150000000,"Summer Fuse",false,false,false,"Ombrello Topolino"],
  ["Capitano Gullini",22000000,"2026-05-23","Secret",2700000000,"Summer Fuse",false,false,false,"Capitano Gullini"],
  ["Coco and Mango",33500000,"2026-05-23","Secret",4500000000,"Summer Fuse",false,false,false,"Coco and Mango"],
  ["Dragon Aquanini",375000000,"2026-05-23","Secret",375000000000,"Summer Fuse",false,false,false,"Dragon Aquanini"],
  ["Steakini Fattini",55000000,"2026-05-30","Secret",12500000000,"Limited Quantity Craft",false,false,false,"Steakini Fattini"],
  ["Caylusaurus",55000000,"2026-06-06","Secret",12500000000,"Limited Quantity Craft",false,false,false,"Caylusaurus"],
  ["Craburger",1300000,"2026-06-13","Secret",350000000,null,null,false,false,"Craburger"],
  ["Rocketini Frostini",3000000,null,"Secret",700000000,"Sammy's Code",false,false,false,"Rocketini Frostini"],
  ["Octoball",3250000,"2026-06-13","Secret",725000000,null,null,false,false,"Octoball"],
  ["Sushi Inu",8000000,"2026-06-13","Secret",1300000000,null,null,false,false,"Sushi Inu"],
  ["Girafini Raftini",18000000,"2026-06-13","Secret",2600000000,null,null,false,false,"Girafini Raftini"],
  ["Frullato Framingo",20000000,null,"Secret",3000000000,"Sammy's Code",false,false,false,"Frullato Framingo"],
  ["Los Fruits",23000000,null,"Secret",3000000000,"Summer Fuse",false,false,false,"Los Fruits"],
  ["Sand Sand Sand",30000000,"2026-06-13","Secret",3000000000,null,null,false,false,"Sand Sand Sand"],
  ["Bearito Cabinito",72500000,"2026-06-13","Secret",21000000000,null,null,false,false,"Bearito Cabinito"],
  ["Venuspino",175000000,null,"Secret",150000000000,"Summer Fuse",false,false,false,"Venuspino"],
  ["Kraken",200000000,"2026-06-13","Secret",200000000000,null,null,false,false,"Kraken"],
  ["Gelato Lumacho",1400000,"2026-06-20","Secret",400000000,"Summer Hour",false,false,false,"Gelato Lumacho"],
  ["Aquarino",4250000,"2026-06-20","Secret",865000000,"Summer Hour",false,false,false,"Aquarino"],
  ["Chicleteira Surfeiteira",16000000,"2026-06-20","Secret",2100000000,"Summer Hour",false,false,false,"Chicleteira Surfeiteira"],
  ["La Summer Grande",60000000,"2026-06-20","Secret",15000000000,"Limited Quantity Craft",false,false,false,"La Summer Grande"],
  ["4th Bros",3750000,"2026-07-04","Secret",800000000,"Admin Abuse",false,false,false,"4th Bros"],
  ["Var Var Var",5500000,"2026-07-04","Secret",1000000000,"Soccer Board",false,false,false,"Var Var Var"],
  ["Chicken Zombie",5500000,"2026-10-17","Secret",1000000000,"Skeleton Event",true,false,false,"Chicken Zombie"],
  ["Bufalino Boomberino",32000000,"2026-07-04","Secret",4000000000,"Limited Quantity Craft",false,false,false,"Bufalino Boomberino"],
  ["Capitano Americano",72500000,"2026-07-04","Secret",21000000000,"Limited Quantity Craft",false,false,false,"Capitano Americano"],
  ["Noodle Noodle Poodle",27500000,"2026-07-18","Secret",3000000000,"The Red Carpet",false,false,false,"Noodle Noodle Poodle"],
  ["Grabatron",62500000,"2026-07-18","Secret",15000000000,"DLC Codes",false,false,false,"Grabatron"],
  ["Rubiko and Kubiko",72500000,"2026-07-18","Secret",21000000000,"Los Traders",false,false,false,"Rubiko and Kubiko"],
  ["Cangurato Gelato",77500000,"2026-07-18","Secret",23500000000,"The Red Carpet",true,false,false,"Cangurato Gelato"],
  ["Toro Españolo",2250000,"2026-07-25","Secret",575000000,"Spain Event",false,false,false,"Toro Españolo"],
  ["Chicleteira Champeona",19000000,"2026-07-25","Secret",2850000000,"Spain Event",false,false,false,"Chicleteira Champeona"],
  ["Examen Bros",70000000,"2026-07-25","Secret",20000000000,"Los Traders",false,false,false,"Examen Bros"],
  ["Pizza and Ranch",130000000,"2026-07-25","Secret",55000000000,null,null,false,false,"Pizza and Ranch"],
  ["Los Secret Combinasionas",150000000,"2026-07-25","Secret",75000000000,"Los Traders",false,false,false,"Los Secret Combinasionas"],
  ["Yess my Resume",2100000,"2026-08-01","Secret",560000000,"Job Ritual",true,false,false,"Yess my Resume"],
  ["Noo my Resume",32500000,"2026-08-01","Secret",4250000000,"Job Ritual",true,false,false,"Noo my Resume"],
  ["Gelatina Volatina",2400000,"2026-08-08","Secret",590000000,"RNG Machine",false,false,false,"Gelatina Volatina"],
  ["Conetto Morsetto",10000000,"2026-08-08","Secret",1500000000,"Bee Merchant",false,false,false,"Conetto Morsetto"],
  ["Pogo Pogo Penguin",12500000,"2026-08-08","Secret",1750000000,"RNG Machine",false,false,false,"Pogo Pogo Penguin"],
  ["Peschito Machito",19000000,"2026-08-08","Secret",2850000000,"RNG Machine",false,false,false,"Peschito Machito"],
  ["Honey Honey Bear",32000000,"2026-08-08","Secret",4000000000,"Bee Merchant",false,false,false,"Honey Honey Bear"],
  ["Scorpino Coasterino",47500000,"2026-08-08","Secret",9250000000,"RNG Machine",false,false,false,"Scorpino Coasterino"],
  ["Queen Bee",65000000,"2026-08-08","Secret",15500000000,"Bee Merchant",false,false,false,"Queen Bee"],
  ["S'more Serat",85000000,"2026-08-08","Secret",25500000000,"Bee Merchant",false,false,false,"S'more Serat"],
  ["Yetimatic",87500000,"2026-08-08","Secret",27500000000,"RNG Machine",false,false,false,"Yetimatic"],
  ["La Breakfast Combinasion",165000000,"2026-08-08","Secret",130000000000,"RNG Machine",false,false,false,"La Breakfast Combinasion"],
  ["Bumbatron",172500000,"2026-08-08","Secret",140000000000,"Bee Merchant",false,false,false,"Bumbatron"],
  ["Polaroidini",55000000,"2026-08-11","Secret",13500000000,"DLC Codes",false,false,false,"Polaroidini"],
  ["Candini Fluffini",57500000,"2026-08-15","Secret",14000000000,"RNG Machine",false,false,false,"Candini Fluffini"],
  ["La Fuse Machine",95000000,"2026-08-15","Secret",35000000000,"RNG Machine",false,false,false,"La Fuse Machine"],
  ["Burrito Bat",7000000,"2026-08-18","Secret",1200000000,"Taco Merchant",false,false,false,"Burrito Bat"],
  ["Tacoturbo Tacorito",26000000,"2026-08-18","Secret",2750000000,"Taco Merchant",false,false,false,"Tacoturbo Tacorito"],
  ["Nachorilla",47500000,"2026-08-18","Secret",9250000000,"Taco Merchant",false,false,false,"Nachorilla"],
  ["Sammyni Truckini",110000000,"2026-08-18","Secret",45000000000,"Taco Merchant",false,false,false,"Sammyni Truckini"],
  ["Honey Honey Narwhal",950000,"2026-08-22","Secret",237500000,"Bee Block",false,false,false,"Honey Honey Narwhal"],
  ["Rosatops Triceratino",3100000,"2026-08-22","Secret",715000000,"Bee Block",false,false,false,"Rosatops Triceratino"],
  ["Syrup Samurai",6700000,"2026-08-22","Secret",1175000000,"Bee Block",false,false,false,"Syrup Samurai"],
  ["Motorino Bumbino",16500000,"2026-08-22","Secret",2250000000,"Bee Block",false,false,false,"Motorino Bumbino"],
  ["Pop Pop Petalini",62500000,"2026-08-22","Secret",15000000000,"Bee Block",false,false,false,"Pop Pop Petalini"],
  ["Orchidox",215000000,"2026-08-22","Secret",215000000000,"Bee Block",false,false,false,"Orchidox"],
  ["Gub",5000000,"2026-08-29","Secret",900000000,"The Red Carpet",true,false,false,"Gub"],
  ["Sir Mangus",7500000,"2026-08-29","Secret",1250000000,"The Red Carpet",true,false,false,"Sir Mangus"],
  ["Gattino Hydrantino",14500000,"2026-08-29","Secret",1950000000,"RNG Machine",false,false,false,"Gattino Hydrantino"],
  ["Puffino Builderino",31000000,"2026-08-29","Secret",3750000000,"RNG Machine",false,false,false,"Puffino Builderino"],
  ["Pelican Pachetto",1750000,"2026-09-12","Secret",525000000,"OG Craft",false,false,false,"Pelican Pachetto"],
  ["Deputy Leopard",18000000,"2026-09-12","Secret",2600000000,"OG Craft",false,false,false,"Deputy Leopard"],
  ["Chicli Chicla",47500000,"2026-09-12","Secret",9250000000,"OG Craft",false,false,false,"Chicli Chicla"],
  ["Panda Popanda",67000000,"2026-09-12","Secret",16000000000,"OG Craft",false,false,false,"Panda Popanda"],
  ["La Craft Machine",75000000,"2026-09-12","Secret",22500000000,"OG Craft",false,false,false,"La Craft Machine"],
  ["Gold and Diamond",85000000,"2026-09-12","Secret",25500000000,"OG Craft",false,false,false,"Gold and Diamond"],
  ["Los Dragons",425000000,"2026-09-12","Secret",425000000000,"OG Craft",false,false,false,"Los Dragons"],
  ["Zebrino Pianino",7250000,"2026-09-19","Secret",1225000000,"OG Craft",false,false,false,"Zebrino Pianino"],
  ["Hydra Serpent",220000000,"2026-09-19","Secret",220000000000,"The Red Carpet",true,false,false,"Hydra Serpent"],
  ["Ranito Pepito",950000,"2026-09-26","Secret",237500000,"Jump for Eggs LTM",false,false,false,"Ranito Pepito"],
  ["Ski Ski Skunki",1600000,"2026-09-26","Secret",510000000,"Jump for Eggs LTM",false,false,false,"Ski Ski Skunki"],
  ["Capibaro Celestino",1750000,"2026-09-26","Secret",525000000,"Jump for Eggs LTM",false,false,false,"Capibaro Celestino"],
  ["Co Co Co Sahur",1750000,"2026-10-17","Secret",525000000,"Skeleton Event",true,false,false,"Co Co Co Sahur"],
  ["Pin Pin Pengu",2300000,"2026-09-26","Secret",580000000,"Jump for Eggs LTM",false,false,false,"Pin Pin Pengu"],
  ["Rexino Ramino",2600000,"2026-09-26","Secret",625000000,"Jump for Eggs LTM",false,false,false,"Rexino Ramino"],
  ["Rockarino Rockara",3000000,"2026-09-26","Secret",700000000,"Jump for Eggs LTM",false,false,false,"Rockarino Rockara"],
  ["Qamar Camelamp",3300000,"2026-09-26","Secret",740000000,"Jump for Eggs LTM",false,false,false,"Qamar Camelamp"],
  ["Marino Submarino",3600000,"2026-09-26","Secret",775000000,"Jump for Eggs LTM",false,false,false,"Marino Submarino"],
  ["Lavamanta",28500000,"2026-09-26","Secret",3250000000,"Jump for Eggs LTM",false,false,false,"Lavamanta"],
  ["Lionello Casarello",58500000,"2026-09-26","Secret",14500000000,"Jump for Eggs LTM",false,false,false,"Lionello Casarello"],
  ["Draculino",120000000,"2026-09-26","Secret",48500000000,"Jump for Eggs LTM",false,false,false,"Draculino"],
  ["Penguino Pumpkino",235,"2026-10-03","Epic",38500,"Haunted Fuse",true,false,false,"Penguino Pumpkino"],
  ["Frostino Vampiro",17500,"2026-10-03","Mythic",5250000,"Haunted Fuse",true,false,false,"Frostino Vampiro"],
  ["Vampi Ribbitini",185000,"2026-10-03","Brainrot God",32500000,"Haunted Fuse",true,false,false,"Vampi Ribbitini"],
  ["Mummelo Bandello",285000,"2026-10-03","Brainrot God",55000000,"Haunted Fuse",true,false,false,"Mummelo Bandello"],
  ["Mortaruga",324000,"2026-10-03","Brainrot God",78500000,"Haunted Fuse",true,false,false,"Mortaruga"],
  ["Los Treaters",1200000,"2026-10-03","Secret",275500000,"Haunted Fuse",true,false,false,"Los Treaters"],
  ["Fangaro Lupino",7250000,"2026-10-03","Secret",1225000000,"Haunted Fuse",true,false,false,"Fangaro Lupino"],
  ["Oni Oni Panda",27000000,"2026-10-03","Secret",2800000000,"Haunted Fuse",true,false,false,"Oni Oni Panda"],
  ["Sammyni Spookyni",80000000,"2026-10-03","Secret",25000000000,"Haunted Fuse",true,false,false,"Sammyni Spookyni"],
  ["Plant Bros",300000000,"2026-10-03","Secret",300000000000,"Haunted Fuse",true,false,false,"Plant Bros"],
  ["Phoenix",425000000,"2026-10-03","Secret",425000000000,"Haunted Fuse",true,false,false,"Phoenix"],
  ["Tic Tic Rick",295000,null,"Brainrot God",65000000,null,null,false,false,"Tic Tic Rick"],
  ["Candi Corni",321000,"2026-10-10","Brainrot God",77500000,"Skull Lucky Block",true,false,false,"Candi Corni"],
  ["Slushi Huski",322500,"2026-10-17","Brainrot God",78000000,"DLC Code",false,false,false,"Slushi Huski"],
  ["Grim Cheese",1600000,"2026-10-10","Secret",510000000,"Skull Lucky Block",true,false,false,"Grim Cheese"],
  ["Zombie Bowl",4500000,"2026-10-10","Secret",875000000,"Skull Lucky Block",true,false,false,"Zombie Bowl"],
  ["Bananito Skelito",8500000,"2026-10-10","Secret",1400000000,"Skull Lucky Block",true,false,false,"Bananito Skelito"],
  ["Bat-in-the-Box",22500000,"2026-10-10","Secret",2750000000,"Skull Lucky Block",true,false,false,"Bat-in-the-Box"],
  ["Boo Boo Rocket",37500000,"2026-10-10","Secret",6000000000,"Skull Lucky Block",true,false,false,"Boo Boo Rocket"],
  ["Flying Dutchman",92500000,"2026-10-10","Secret",32500000000,"Skull Lucky Block",true,false,false,"Flying Dutchman"],
  ["Cobra Gelato",77500000,"2026-10-17","Secret",23500000000,"DLC Code",false,false,false,"Cobra Gelato"],
  ["Dragon Skeletonini",325000000,"2026-10-10","Secret",325000000000,"Skull Lucky Block",true,false,false,"Dragon Skeletonini"],
  ["Tosto Dino",27000000,"2026-10-13","Secret",2800000000,"Limited Quantity Craft",false,false,false,"Tosto Dino"],
  ["Spooky Kart",13000000,"2026-10-31","Secret",1800000000,"Headless Merchant",true,false,false,"Spooky Kart"],
  ["Jacko Jakat",41000000,"2026-10-31","Secret",7250000000,"Headless Merchant",true,false,false,"Jacko Jakat"],
  ["Scorpi Inferni",76000000,"2026-10-31","Secret",23000000000,"Headless Merchant",true,false,false,"Scorpi Inferni"],
  ["Scarino Crowino",135000000,"2026-10-31","Secret",57500000000,"Trick Or Treat",true,false,false,"Scarino Crowino"],
  ["Puppetmaster",177500000,"2026-10-31","Secret",155000000000,"Headless Merchant",true,false,false,"Puppetmaster"],
  ["Bling Luming",2600000,"2026-11-07","Secret",625000000,"The Red Carpet",true,false,false,"Bling Luming"],
  ["Balloon Baboon",23500000,"2026-11-07","Secret",3250000000,"The Red Carpet",true,false,false,"Balloon Baboon"],
  ["Skibidi Toilet",450000000,"2025-12-27","OG",450000000000,"The Red Carpet",true,false,true,"Skibidi Toilet"],
  ["Strawberry Elephant",750000000,"2025-08-30","OG",750000000000,"The Red Carpet",true,false,true,"Strawberry Elephant"],
  ["Spyder Elephant",1000000000,"2026-05-16","OG",1000000000000,null,null,true,true,"Spyder Elephant"],
  ["Headless Horseman",600000000,"2025-10-25","OG",600000000000,"Witch's Fuse",false,false,false,"Headless Horseman"],
  ["Meowl",600000000,"2025-10-18","OG",650000000000,"The Red Carpet",true,false,true,"Meowl"],
  ["John Pork",500000000,"2026-05-02","OG",500000000000,"The Red Carpet",true,false,true,"John Pork"],
  ["Mythic Lucky Block",0,null,"Mythic",2500000,null,null,true,false,"Lucky Block"],
  ["Brainrot God Lucky Block",0,null,"Brainrot God",25000000,null,null,true,false,"Lucky Block"],
  ["Secret Lucky Block",0,null,"Secret",750000000,null,null,true,false,"Lucky Block"],
  ["Admin Lucky Block",0,"2025-09-13","Admin",100000000,null,null,true,false,"Lucky Block"],
  ["Taco Lucky Block",0,null,"Taco",50000000,null,null,true,false,"Lucky Block"],
  ["Los Lucky Blocks",0,null,"Admin",250000000,null,null,true,false,"Los Lucky Blocks"],
  ["Spooky Lucky Block",0,null,"Spooky",350000000,null,null,true,false,"Spooky Lucky Block"],
  ["Los Taco Blocks",0,null,"Taco",300000000,null,null,true,false,"Los Taco Blocks"],
  ["Festive Lucky Block",0,null,"Festive",400000000,null,null,true,false,"Festive Lucky Block"],
  ["Premium Festive Lucky Block",0,null,"Festive",400000000,null,null,true,false,"Premium Festive Lucky Block"],
  ["Heart Lucky Block",0,null,"Valentines",350000000,null,null,true,false,"Heart Lucky Block"],
  ["Premium Heart Lucky Block",0,null,"Valentines",350000000,null,null,true,false,"Premium Heart Lucky Block"],
  ["Leprechaun Lucky Block",0,null,"St Patrick's",400000000,null,null,true,false,"Leprechaun Lucky Block"],
  ["Premium Leprechaun Lucky Block",0,null,"St Patrick's",400000000,null,null,true,false,"Premium Leprechaun Lucky Block"],
  ["Egg Lucky Block",0,null,"Easter",500000000,null,null,true,false,"Egg Lucky Block"],
  ["Premium Egg Lucky Block",0,null,"Easter",500000000,null,null,true,false,"Premium Egg Lucky Block"],
  ["Octo Lucky Block",0,null,"Summer",600000000,null,null,true,false,"Octo Lucky Block"],
  ["Premium Octo Lucky Block",0,null,"Summer",600000000,null,null,true,false,"Premium Octo Lucky Block"],
  ["Bee Lucky Block",0,null,"Honey",400000000,null,null,true,false,"Bee Lucky Block"],
  ["Premium Bee Lucky Block",0,null,"Honey",400000000,null,null,true,false,"Premium Bee Lucky Block"],
  ["Skull Lucky Block",0,null,"Skull",500000000,null,null,true,false,"Skull Lucky Block"],
  ["Premium Skull Lucky Block",0,null,"Skull",500000000,null,null,true,false,"Premium Skull Lucky Block"],
  ["Cavallo Virtuoso Egg",0,null,"Mythic",1250000,null,null,true,false,"Cavallo Virtuoso Egg"],
  ["Tartaruga Cisterna Egg",0,null,"Brainrot God",22500000,null,null,true,false,"Tartaruga Cisterna Egg"],
  ["Graipuss Medussi Egg",0,null,"Secret",125000000,null,null,true,false,"Graipuss Medussi Egg"],
  ["Zebrino Pianino Egg",0,null,"Secret",612500000,null,null,true,false,"Zebrino Pianino Egg"],
  ["Extinct Ballerina Egg",0,null,"Brainrot God",11750000,null,null,true,false,"Extinct Ballerina Egg"],
  ["Craburger Egg",0,null,"Secret",175000000,null,null,true,false,"Craburger Egg"],
  ["Rexino Ramino Egg",0,null,"Secret",312500000,null,null,true,false,"Rexino Ramino Egg"],
  ["Qamar Camelamp Egg",0,null,"Secret",370000000,null,null,true,false,"Qamar Camelamp Egg"],
  ["La Grande Combinasion Egg",0,null,"Secret",500000000,null,null,true,false,"La Grande Combinasion Egg"],
  ["Frio Ninja Egg",0,null,"Brainrot God",23250000,null,null,true,false,"Frio Ninja Egg"],
  ["Ski Ski Skunki Egg",0,null,"Secret",255000000,null,null,true,false,"Ski Ski Skunki Egg"],
  ["Rockarino Rockara Egg",0,null,"Secret",350000000,null,null,true,false,"Rockarino Rockara Egg"],
  ["Chill Puppy Egg",0,null,"Secret",425000000,null,null,true,false,"Chill Puppy Egg"],
  ["Yetimatic Egg",0,null,"Secret",13750000000,null,null,true,false,"Yetimatic Egg"],
  ["Sammyni Spyderini Egg",0,null,"Secret",42500000,null,null,true,false,"Sammyni Spyderini Egg"],
  ["Pin Pin Pengu Egg",0,null,"Secret",290000000,null,null,true,false,"Pin Pin Pengu Egg"],
  ["Chicleteira Bicicleteira Egg",0,null,"Secret",375000000,null,null,true,false,"Chicleteira Bicicleteira Egg"],
  ["Sir Mangus Egg",0,null,"Secret",625000000,null,null,true,false,"Sir Mangus Egg"],
  ["Draculino Egg",0,null,"Secret",24250000000,null,null,true,false,"Draculino Egg"],
  ["Fishboard Egg",0,null,"Secret",107500000,null,null,true,false,"Fishboard Egg"],
  ["Marino Submarino Egg",0,null,"Secret",387500000,null,null,true,false,"Marino Submarino Egg"],
  ["Arcadopus Egg",0,null,"Secret",450000000,null,null,true,false,"Arcadopus Egg"],
  ["Swag Soda Egg",0,null,"Secret",900000000,null,null,true,false,"Swag Soda Egg"],
  ["Capitano Moby Egg",0,null,"Secret",62500000000,null,null,true,false,"Capitano Moby Egg"],
  ["Ranito Pepito Egg",0,null,"Secret",118750000,null,null,true,false,"Ranito Pepito Egg"],
  ["To to to Sahur Egg",0,null,"Secret",287500000,null,null,true,false,"To to to Sahur Egg"],
  ["Burrito Bat Egg",0,null,"Secret",600000000,null,null,true,false,"Burrito Bat Egg"],
  ["Lavamanta Egg",0,null,"Secret",1625000000,null,null,true,false,"Lavamanta Egg"],
  ["Cerberus Egg",0,null,"Secret",75000000000,null,null,true,false,"Cerberus Egg"],
  ["Capibaro Celestino Egg",0,null,"Secret",262500000,null,null,true,false,"Capibaro Celestino Egg"],
  ["Cupid Cupid Sahur Egg",0,null,"Secret",357500000,null,null,true,false,"Cupid Cupid Sahur Egg"],
  ["DJ Panda Egg",0,null,"Secret",1250000000,null,null,true,false,"DJ Panda Egg"],
  ["Lionello Casarello Egg",0,null,"Secret",7250000000,null,null,true,false,"Lionello Casarello Egg"],
  ["Dragon Cannelloni Egg",0,null,"Secret",125000000000,null,null,true,false,"Dragon Cannelloni Egg"],
  ["Gold Egg",0,null,"Secret",0,null,null,true,false,"Gold Egg"],
  ["Gold Elf",0,null,"Secret",0,null,null,true,false,"Gold Elf"],
  ["Wheelchair Granny",0,null,"Secret",0,null,null,true,true,"Granny"]
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
1. For current questions, use relevant RECENT CLIENT DATA with a clear subject and timeframe. For exact game fields, prefer verified real SAB data.
2. For Sammy facts, use the supplied developer facts and any newer explicit corrections.
3. For stable game facts, use the documented Info Book fields and their source notes. The roster and canonical fields come from the real SAB Animals dump. Wiki data supplies historical context.
4. For non-game facts, use ordinary settled general knowledge.
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
- Expand shared subjects: "rarity and income of Los Dragons" asks for rarity first and base income second. "Income and rarity of Los Dragons" reverses the order.
- Treat explicitly supplied literals as their own fragments. Preserve decimal points within numeric values and leading zeroes in literal codes.
- Use unknown for an unresolved required fragment. Keep its position.

LIVE STATE RULES
- Resolve "it", "its", "this", "that", "shown Brainrot", and avatar clues from the most recent relevant notification when the subject is clear.
- A character, avatar, car, and personal favorite can have different colors. Use the requested field.
- For avatar ID 2678001507, the recorded color is red. Use an explicit current avatar color if supplied.
- A game update timestamp alone cannot establish which event, fuse, or mutation is active. Historical records answer historical questions.
- A saved Index count is a timestamped snapshot. Use the specified mutation, default to the unmutated entry, preserve numeric zero, and use unknown for missing counts.
- If a clue asks for a blank in an established name, return only the missing part. "Dragon ______" can be Cannelloni when the surrounding clue establishes Dragon Cannelloni.

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
- Car color: Red
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
- When a clue requests month and day, use the spelled month followed by the day, for example september27. Include the year only when requested as a component or when returning a full release date.

FINAL CHECK
Before answering: use the Info Book instead of guessing SAB facts; preserve literal numbers; preserve multipart order; return only the exact requested value.`;

// Keep the full prompt readable in source. Select optional sections once per request.
const promptSections = STORED_AI_PROMPT.split(/\n\n(?=[A-Z][A-Z /0-9—-]+\n)/);
const optionalPromptSections = new Map([
  ["MULTIPART / CODE RIDDLES", /\b(code|concatenate|fragment|combine|join|plus|delimiter)\b/],
  ["LIVE STATE RULES", /\b(it|its|this|that|shown|avatar|current|active|latest|index|exist|blank|notification)\b/],
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
  if (recentContext) selected.push("=== RECENT CLIENT DATA ===\n" + recentContext);
  const updateNumbers = [...new Set([...question.matchAll(/\bupdate (\d+)\b/g)].map(match => String(Number(match[1]))))];
  for (const number of updateNumbers) {
    const page = wikiTables["update-pages"].find(([id]) => id === number);
    if (page) selected.push("=== UPDATE " + number + " ===\n" + page.slice(1).join(" | ") +
      "\nBrainrots listed in the update: " + updateBrainrotNames(number).join(", "));
  }
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
  ["my car color","red"],
  ["my car's color","red"],
  ["what color is my car","red"],
  ["what colour is my car","red"],
  ["what is my car color","red"],
  ["what is my car's color","red"],
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
const OG_PRICES = {"Skibidi Toilet":450000000000,"Strawberry Elephant":750000000000,"Spyder Elephant":1000000000000,"Headless Horseman":600000000000,"Meowl":650000000000,"John Pork":500000000000};
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
const BRAINROT_OBTAIN_SOURCES = new Map(BRAINROT_CATALOG.filter(row => row[5]).map(([name,,,,,source]) => [brainrotKey(name), source]));

function brainrotObtainSource(question) {
  const q = brainrotKey(question);
  const match = q.match(/^(?:how|where) (?:do you |can (?:i|you|we) |did (?:i|you|we) |you |to )?(?:obtain|get|find|unlock|acquire) (.+)$/)
    || q.match(/^(?:how|where) (?:is|was) (.+) (?:obtained|acquired|found|unlocked)(?: from)?$/)
    || q.match(/^(?:where|what machine|what fuse|what event) (?:does|did) (.+) (?:come from|release in)$/)
    || q.match(/^(?:(?:what is|whats|what s) )?(?:the )?(?:obtain source|acquisition source|source) (?:of|for) (.+)$/);
  if (!match) return null;
  const name = brainrotKey(match[1]).replace(/^the /, "");
  return BRAINROT_OBTAIN_SOURCES.get(name) || BRAINROT_OBTAIN_SOURCES.get(name.replace(/ brainrot$/, "")) || null;
}

function brainrotKey(value) { return normalizeDirect(String(value ?? "").normalize("NFD").replace(/\p{M}/gu, "")).replaceAll("'", ""); }
const brainrotsByName = new Map(BRAINROT_CATALOG.map(entry => [brainrotKey(entry[0]), entry]));
const directoryByName = new Map(directoryMetadata.map(row => [brainrotKey(row[0]), row]));
const BRAINROT_REFERENCE = BRAINROT_CATALOG.map(([name, income, release, rarity, cost, source, obtainable, hidden, ignored, display]) => {
  const [, , , directoryIncome, , directorySources] = directoryByName.get(brainrotKey(name)) ?? [];
  return {name, income, release, rarity, cost, source, obtainable, hidden, ignored, display, directoryIncome, directorySources};
});

function formatBrainrotReference({name, income, release, source}) {
  return [name, income == null ? "unknown" : formatBrainrotIncome(income) + "/s", release ?? "unknown", source ?? "unknown"].join(" | ");
}

function brainrotCard({name, income, release, rarity, cost, source, directorySources, directoryIncome, obtainable, hidden, ignored, display}) {
  const lines = [
    "Brainrot: " + name,
    "Base income per second: " + (income == null ? "unknown" : formatBrainrotIncome(income) + "/s (" + income + ")"),
    "Rarity: " + (rarity ?? "unknown"),
    "Base purchase price: " + (cost > 0 ? formatBrainrotIncome(cost) : "unknown"),
    "Documented debut: " + (release ?? "unknown"),
    "Animals acquisition source: " + (source ?? "unknown"),
    "Acquisition flag: " + (obtainable ?? "unknown"),
    "Hidden from Index: " + hidden + " | Excluded from Index counter: " + ignored
  ];
  if (display !== name) lines.push("Display name: " + display);
  if (directorySources?.length) lines.push("Directory acquisition tags: " + directorySources.join(", "));
  if (directoryIncome > 0 && income != null && directoryIncome !== income) {
    lines.push("Directory reports " + formatBrainrotIncome(directoryIncome) + "/s. Keep the game snapshot value above unless real SAB supplies a live value.");
  }
  return lines;
}

const REFERENCE_COLUMNS = {
  rebirth:"Level | required cash | required Brainrots | multiplier",
  "lucky-blocks":"Block | drop | chance | wiki income at time of snapshot",
  rituals:"Ritual | spawn | requirements",
  machines:"Machine | input when documented | availability in source snapshot",
  events:"Event | wiki category | historical dates where supplied",
  "fuse-machine":"Historical fuse outputs and examples",
  "update-log":"Update number | release date",
  "update-themes":"Update number | documented theme",
  "update-pages":"Update number | date or TBA | article sections",
  "update-brainrots":"Update number | matched real SAB Brainrot listed on the page"
};
const REFERENCE_SECTIONS = Object.fromEntries(Object.entries(wikiTables).map(([topic, rows]) => [
  topic, topic.toUpperCase() + " — " + REFERENCE_COLUMNS[topic] + "\n" + rows.map(row => row.join(" | ")).join("\n")
]));

const STATIC_INFO_BOOK = [
  "STEAL A BRAINROT INFO BOOK",
  "Catalog snapshot. Unknown fields are unpublished or absent. Roster, base income, prices, rarities, and acquisition fields come from the supplied real SAB Animals dump. Wiki records supplement documented dates and historical context. Voltra reads real SAB acquisition sources at runtime when available.",
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
  ...Object.keys(wikiTables).filter(topic => !["update-themes", "update-pages", "update-brainrots"].includes(topic)).map(topic => "https://stealabrainrot.wiki/wiki/" + topic + "/"),
  ...wikiTables["update-pages"].map(([number]) => "https://stealabrainrot.wiki/wiki/update-log/update-" + number.padStart(2, "0") + "/"),
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

function updateBrainrotNames(number) {
  return wikiTables["update-brainrots"].filter(([id]) => id === number).map(([, name]) => name);
}

function catalogClueAnswer(question, recentContext) {
  if (recentContext) return null;
  const clue = brainrotKey(question).replace(/^(?:what is|what was|whats|tell me) /, "").replace(/^the /, "");
  const property = clue.match(/^(?:rarity|price|cost) (?:of|for) (.+)$/)
    || clue.match(/^how much does (.+) cost$/)
    || clue.match(/^what rarity is (.+)$/);
  if (property) {
    const row = findBrainrot(property[1]);
    const [, , , rarity, price] = row ?? [];
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
    const row = wikiTables["update-pages"].find(([number]) => number === String(Number(update[1] ?? update[2])));
    if (row) return row[1] === "TBA" ? "unknown" : formatReleaseDate(row[1]);
  }
  const updateRoster = clue.match(/^(?:what|which) brainrots (?:were added|are listed) in update (\d+)$/)
    || clue.match(/^(?:list )?(?:the )?brainrots (?:from|in) update (\d+)$/);
  if (updateRoster) {
    const names = updateBrainrotNames(String(Number(updateRoster[1])));
    if (names.length) return names.join(", ");
  }
  const updateTheme = clue.match(/^(?:theme|name) of update (\d+)$/)
    || clue.match(/^update (\d+) called$/);
  if (updateTheme) {
    const row = wikiTables["update-themes"].find(([number]) => number === updateTheme[1]);
    if (row) return row[1];
  }
  const machine = clue.match(/^what (?:does|do) (?:the )?(.+ machine) (?:require|need)$/)
    || clue.match(/^requirements? (?:of|for) (?:the )?(.+ machine)$/);
  if (machine) {
    const row = wikiTables.machines.find(([name]) => brainrotKey(name) === machine[1]);
    if (row && row[1] !== "see wiki") return row[1];
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
  if (/\bavatar\b/.test(q) && /\bcolou?r\b/.test(q)) {
    const lines = c.split(/\r?\n/).reverse();
    for (const line of lines) {
      const explicit = line.match(/\bavatar colou?r\s*[:=]\s*([a-z]+(?:[ -][a-z]+)*)\s*$/);
      if (explicit) return explicit[1];
      const avatar = line.match(/rbxthumb:\/\/type=avatarheadshot&id=(\d+)\b/);
      if (avatar) return avatar[1] === "2678001507" ? "red" : null;
    }
  }

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

  const sharedSubject = normalizeDirect(raw).match(/^(?:what (?:is|are) )?(?:the )?(rarity|income|base income|price|cost) and (?:the )?(rarity|income|base income|price|cost) (?:of|for) (.+)$/);
  if (sharedSubject && findBrainrot(sharedSubject[3])) {
    const [, first, second, name] = sharedSubject;
    return [first + " of " + name, second + " of " + name];
  }

  let pieces = raw
    .split(/[;,\n]+|\?\s*(?=(?:and\s+)?(?:what|how|who|when|where|which)\b)|\s+and\s+(?=(?:(?:what|how|who|when|where|which|my)\b|(?:the\s+)?day\s+today\b))/i)
    .map((piece, index) => index ? piece.trim().replace(/^and\s+/i, "") : piece.trim())
    .filter(Boolean);

  if (pieces.length === 1) {
    const m = raw.match(/^(.*\D)\s+(-?\d+(?:\.\d+)?%?)\s*$/);
    if (m && m[1].trim()) pieces = [m[1].trim(), m[2]];
  }

  return pieces;
}

function isContextSensitive(question) {
  const clue = normalizeDirect(question);
  return isLiveIndexQuestion(question) || /\b(?:it|its|this|that|current|currently|active|now|today|new|newest|latest|recent|shown|avatar|notification|upcoming|next)\b/.test(clue)
    || isCurrentMutationClue(question) || isNextMutationClue(question) || Boolean(directDateAnswer(question));
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

  const previousBook = await response.text();
  const liveIndex = previousBook.lastIndexOf("\n\nLIVE INDEX EXIST COUNTS");
  const text = liveIndex < 0 ? STATIC_INFO_BOOK : STATIC_INFO_BOOK + previousBook.slice(liveIndex);

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
    const useAnswerCache = !recentContext && !/\bbrainrot (?:added|from the (?:latest|new) update)\b/.test(normalizeDirect(originalQuestion)) && !pieces.some(isContextSensitive);
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
        unresolved.map(row => recentContext || isContextSensitive(row.clue) ? null : getEdgeAnswer(url, row.clue))
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
        if (!recentContext && !isContextSensitive(row.clue)) putEdgeAnswer(ctx, url, row.clue, answer);
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
