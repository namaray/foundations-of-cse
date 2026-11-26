// Example machines for the automaton simulator (AutomatonSim.astro).
// Positions are in a 560 × 230 drawing area. 'ε' marks an epsilon move.

export interface Machine {
	id: string;
	name: string;
	kind: 'dfa' | 'nfa';
	language: string; // plain-text description of what it accepts
	alphabet: string[];
	states: Record<string, { x: number; y: number; loop?: 'above' | 'below' }>;
	start: string;
	accept: string[];
	delta: Record<string, Record<string, string[]>>;
	bend?: Record<string, number>; // "from>to": curve amount for that edge
	samples: string[];
	notes?: Record<string, string>; // what each state "remembers"
}

export const machines: Record<string, Machine> = {
	'dfa-ends-01': {
		id: 'dfa-ends-01',
		name: 'Ends in 01',
		kind: 'dfa',
		language: 'binary strings that end in 01',
		alphabet: ['0', '1'],
		states: { A: { x: 100, y: 115 }, B: { x: 280, y: 115 }, C: { x: 460, y: 115 } },
		start: 'A',
		accept: ['C'],
		delta: {
			A: { '0': ['B'], '1': ['A'] },
			B: { '0': ['B'], '1': ['C'] },
			C: { '0': ['B'], '1': ['A'] },
		},
		bend: { 'B>C': 22, 'C>B': 22, 'C>A': -78 },
		samples: ['1101', '0110', '01', '0', '10101'],
		notes: { A: 'no progress towards 01', B: 'last symbol was 0', C: 'last two symbols were 01' },
	},
	'dfa-div-3': {
		id: 'dfa-div-3',
		name: 'Divisible by 3',
		kind: 'dfa',
		language: 'binary numbers divisible by 3',
		alphabet: ['0', '1'],
		states: { q0: { x: 100, y: 115 }, q1: { x: 280, y: 115 }, q2: { x: 460, y: 115 } },
		start: 'q0',
		accept: ['q0'],
		delta: {
			q0: { '0': ['q0'], '1': ['q1'] },
			q1: { '0': ['q2'], '1': ['q0'] },
			q2: { '0': ['q1'], '1': ['q2'] },
		},
		bend: { 'q0>q1': 22, 'q1>q0': 22, 'q1>q2': 22, 'q2>q1': 22 },
		samples: ['110', '1001', '111', '10010', '0'],
		notes: { q0: 'value so far ≡ 0 (mod 3)', q1: 'value so far ≡ 1 (mod 3)', q2: 'value so far ≡ 2 (mod 3)' },
	},
	'dfa-contains-aba': {
		id: 'dfa-contains-aba',
		name: 'Contains aba',
		kind: 'dfa',
		language: 'strings over {a, b} that contain aba',
		alphabet: ['a', 'b'],
		states: { s0: { x: 70, y: 115 }, s1: { x: 210, y: 115 }, s2: { x: 350, y: 115 }, s3: { x: 490, y: 115 } },
		start: 's0',
		accept: ['s3'],
		delta: {
			s0: { a: ['s1'], b: ['s0'] },
			s1: { a: ['s1'], b: ['s2'] },
			s2: { a: ['s3'], b: ['s0'] },
			s3: { a: ['s3'], b: ['s3'] },
		},
		bend: { 's2>s0': -70 },
		samples: ['babab', 'abba', 'aaba', 'bbb'],
		notes: { s0: 'no progress', s1: 'seen a', s2: 'seen ab', s3: 'found aba (trap: stays accepting)' },
	},
	'nfa-ends-01': {
		id: 'nfa-ends-01',
		name: 'Ends in 01',
		kind: 'nfa',
		language: 'binary strings that end in 01',
		alphabet: ['0', '1'],
		states: { q0: { x: 110, y: 120 }, q1: { x: 280, y: 120 }, q2: { x: 450, y: 120 } },
		start: 'q0',
		accept: ['q2'],
		delta: {
			q0: { '0': ['q0', 'q1'], '1': ['q0'] },
			q1: { '1': ['q2'] },
			q2: {},
		},
		samples: ['1101', '0110', '0101', '00'],
		notes: { q0: 'still waiting for the final 01', q1: 'guessed: this 0 starts the final 01', q2: 'read the final 01' },
	},
	'nfa-a-star-b-star': {
		id: 'nfa-a-star-b-star',
		name: 'a*b* (with ε)',
		kind: 'nfa',
		language: 'some a’s followed by some b’s (a*b*)',
		alphabet: ['a', 'b'],
		states: { p: { x: 170, y: 120 }, q: { x: 390, y: 120 } },
		start: 'p',
		accept: ['q'],
		delta: {
			p: { a: ['p'], 'ε': ['q'] },
			q: { b: ['q'] },
		},
		samples: ['aabb', 'abab', 'bbb', ''],
		notes: { p: 'reading the a’s', q: 'reading the b’s' },
	},
	'nfa-third-from-end': {
		id: 'nfa-third-from-end',
		name: '3rd from end is 1',
		kind: 'nfa',
		language: 'binary strings whose third symbol from the end is 1',
		alphabet: ['0', '1'],
		states: { q0: { x: 70, y: 120 }, q1: { x: 210, y: 120 }, q2: { x: 350, y: 120 }, q3: { x: 490, y: 120 } },
		start: 'q0',
		accept: ['q3'],
		delta: {
			q0: { '0': ['q0'], '1': ['q0', 'q1'] },
			q1: { '0': ['q2'], '1': ['q2'] },
			q2: { '0': ['q3'], '1': ['q3'] },
			q3: {},
		},
		samples: ['0100', '1011', '110010', '011'],
		notes: { q0: 'waiting', q1: 'guessed: this 1 is third from the end', q2: 'one more symbol read', q3: 'exactly two symbols after the guessed 1' },
	},
};
