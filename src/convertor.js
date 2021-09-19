const { v4 } = require("uuid");
const SusAnalyzer = require("sus-analyzer");
const { NoteType, CurveType, FlickDirection } = require('@fannithm/const/js/pjsk');


/**
 * Map convertor
 * @param {string} sus sus data
 * @returns fannithm map data
 */
function convertor(sus) {
	const tickPerBeat = 480;
	const susData = getScore(sus, tickPerBeat);
	const id1 = v4();
	const data = {
		timelines: [
			{
				id: id1,
				name: "Timeline 1"
			}
		],
		bpms: [
			{
				id: v4(),
				timeline: id1,
				beat: [
					0,
					0,
					1
				],
				bpm: susData.BPMs[0]
			}
		],
		notes: [],
		slides: []
	};

	susData.slideNotes.forEach(slide => {
		const _slide = {
			id: v4(),
			timeline: id1,
			notes: [],
		}
		slide.forEach((note, index) => {
			const airIndex = susData.airNotes.findIndex(
				note1 => onSamePosition(note, note1)
			);
			const flickIndex = susData.shortNotes.findIndex(
				note1 => note1.noteType === 3 && onSamePosition(note, note1)
			);
			const noteIndex = susData.shortNotes.findIndex(
				note1 => onSamePosition(note, note1)
			);
			const _note = {
				id: v4(),
				type: {
					1: NoteType.SlideStart,
					2: NoteType.SlideEndDefault,
					3: NoteType.SlideVisible,
					5: NoteType.SlideInvisible
				}[note.noteType],
				beat: getBeat(note.measure, note.tick, tickPerBeat),
				lane: note.lane - 2,
				width: note.width,
				curve: CurveType.Linear
			};
			// critical slide
			if (index === 0 && noteIndex !== -1 && susData.shortNotes[noteIndex].noteType === 2) {
				susData.shortNotes.splice(noteIndex, 1);
				_slide.critical = true;
				// end flick
			} else if (_note.type === NoteType.SlideEndDefault && airIndex !== -1) {
				const [air] = susData.airNotes.splice(airIndex, 1);
				_note.type = NoteType.SlideEndFlick;
				_note.direction = air.noteType === 3 ? FlickDirection.Left :
					(air.noteType === 4 ? FlickDirection.Right : FlickDirection.Up);
				// end critical flick
				if (noteIndex !== -1) {
					const [node] = susData.shortNotes.splice(noteIndex, 1);
					if (node.noteType === 2) _note.critical = true;
				}
				// curve
			} else if (airIndex !== -1 && noteIndex !== -1) {
				susData.shortNotes.splice(noteIndex, 1);
				const [air] = susData.airNotes.splice(airIndex, 1);
				_note.curve = {
					2: CurveType.EaseOut,
					5: CurveType.EaseIn,
					6: CurveType.EaseIn
				}[air.noteType];
			}
			// un-positioned node
			if (flickIndex !== -1 && _note.type === NoteType.SlideVisible) {
				susData.shortNotes.splice(flickIndex, 1);
				delete _note.width;
				delete _note.lane;
				delete _note.curve;
			}
			_slide.notes.push(_note);
		});
		data.slides.push(_slide);
	});

	susData.shortNotes.forEach(note => {
		if (note.lane < 2 || note.lane > 13) return;
		// if (note.type !== 1 && note.type !== 2) return;
		const air = susData.airNotes.find(
			air => onSamePosition(air, note)
		);
		const _note = {
			id: v4(),
			timeline: id1,
			type: air ? NoteType.Flick : NoteType.Tap, // 0: tap, 1: flick
			beat: getBeat(note.measure, note.tick, tickPerBeat),
			lane: note.lane - 2,
			width: note.width
		}
		if (note.noteType === 2) _note.critical = true;
		if (air) _note.direction = air.noteType === 3 ? FlickDirection.Left : (air.noteType === 4 ? FlickDirection.Right : FlickDirection.Up);
		data.notes.push(_note);
	});

	return data;
}

/**
 * @param {string} sus sus data
 * @param {number} tickPerBeat tick per beat
 * @returns {import("sus-analyzer").ISusScore}
 */
function getScore(sus, tickPerBeat) {
	return SusAnalyzer.getScore(sus, tickPerBeat);
}

module.exports = {
	convertor,
	getScore
}

function gcd(a, b) {
	if (a === 0 || b === 0) return Math.max(a, b, 1);
	while (b !== 0) {
		const r = b;
		b = a % b;
		a = r;
	}
	return a;
}

function onSamePosition(note1, note2) {
	return note1.measure === note2.measure
		&& note1.tick === note2.tick
		&& note1.lane === note2.lane
		&& note1.width === note2.width
}

function getBeat(measure, tick, tickPerBeat) {
	const _gcd = gcd(tick % tickPerBeat, tickPerBeat);
	return [
		measure * 4 + Math.floor(tick / tickPerBeat),
		(tick % tickPerBeat) / _gcd,
		tick ? (tickPerBeat / _gcd) : 1
	]
}