export =
class Morse {
	static decode(en: string) {
		return en
			.split(' ')
			.map(a => {
				//	Error handling
				if(!map[a])
					throw new Error('(DECODE) Couldn\'t recognize ' + a);
				
				//	Returning message
				return map[a];
			})
			.join('');
	}


	//	much easier xD
	static encode(dec: string) {
		return dec
			.toUpperCase()
			.split('')
			.map(a => {
				if(!reverseMap[a])
					throw new Error('(ENCODE) Couldn\'t recognize ' + a);

				return reverseMap[a];
			})
			.join(' ');
	}
}


















//	Code Maps
const reverseMap: {[index: string]:string} = {
	'A': '.-',
	'B': '-...',
	'C': '-.-.',
	'D': '-..',
	'E': '.',
	'F': '..-.',
	'G': '--.',
	'H': '....',
	'I': '..',
	'J': '.---',
	'K': '-.-',
	'L': '.-..',
	'M': '--',
	'N': '-.',
	'O': '---',
	'P': '.--.',
	'Q': '--.-',
	'R': '.-.',
	'S': '...',
	'T': '-',
	'U': '..-',
	'V': '...-',
	'W': '.--',
	'X': '-..-',
	'Y': '-.--',
	'Z': '--..',
	'Á': '.--.-', // A with acute accent
	'Ä': '.-.-',  // A with diaeresis
	'É': '..-..', // E with acute accent
	'Ñ': '--.--', // N with tilde
	'Ö': '---.',  // O with diaeresis
	'Ü': '..--',  // U with diaeresis
	'1': '.----',
	'2': '..---',
	'3': '...--',
	'4': '....-',
	'5': '.....',
	'6': '-....',
	'7': '--...',
	'8': '---..',
	'9': '----.',
	'0': '-----',
	'!': '-.-.--',
	',': '--..--',  // comma
	'.': '.-.-.-',  // period
	'?': '..--..',  // question mark
	';': '-.-.-',   // semicolon
	':': '---...',  // colon
	'/': '-..-.',   // slash
	'-': '-....-',  // dash
	"'": '.----.',  // apostrophe
	'()': '-.--.-', // parenthesis
	'_': '..--.-',  // underline
	'@': '.--.-.',  // at symbol from http://www.learnmorsecode.com/
	' ': '/',
};

const map: {[index: string]:string} = {};

for (const key in reverseMap) {
	map[reverseMap[key]] = key;
}