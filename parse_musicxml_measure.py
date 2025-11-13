#!/usr/bin/env python3
"""
MusicXML Measure Parser for KALLYNI Project
Parses individual MusicXML measures and extracts musical information.
"""

import xml.etree.ElementTree as ET
from typing import Dict, List, Optional, Union
import json


class Note:
    """Represents a musical note with all its properties."""

    def __init__(self):
        self.pitch: Optional[Dict[str, Union[str, int]]] = None
        self.duration: Optional[int] = None
        self.note_type: Optional[str] = None
        self.is_chord: bool = False
        self.is_rest: bool = False
        self.dynamics: Optional[str] = None
        self.articulations: List[str] = []
        self.technical: List[Dict[str, str]] = []
        self.ornaments: List[Dict[str, str]] = []
        self.lyrics: List[str] = []

    def to_dict(self) -> Dict:
        """Convert note to dictionary representation."""
        result = {
            'is_chord': self.is_chord,
            'is_rest': self.is_rest
        }

        if self.pitch:
            result['pitch'] = self.pitch

        if self.duration is not None:
            result['duration'] = self.duration

        if self.note_type:
            result['type'] = self.note_type

        if self.dynamics:
            result['dynamics'] = self.dynamics

        if self.articulations:
            result['articulations'] = self.articulations

        if self.technical:
            result['technical'] = self.technical

        if self.ornaments:
            result['ornaments'] = self.ornaments

        if self.lyrics:
            result['lyrics'] = self.lyrics

        return result

    def __repr__(self) -> str:
        if self.is_rest:
            return f"Rest(duration={self.duration}, type={self.note_type})"

        pitch_str = ""
        if self.pitch:
            step = self.pitch['step']
            alter = self.pitch.get('alter', 0)
            octave = self.pitch['octave']

            alter_symbol = ""
            if alter == 1:
                alter_symbol = "#"
            elif alter == -1:
                alter_symbol = "b"
            elif alter > 1:
                alter_symbol = f"+{alter}"
            elif alter < -1:
                alter_symbol = f"-{abs(alter)}"

            pitch_str = f"{step}{alter_symbol}{octave}"

        chord_str = " (chord)" if self.is_chord else ""
        dynamics_str = f" {self.dynamics}" if self.dynamics else ""

        return f"Note({pitch_str}{chord_str}, {self.note_type}{dynamics_str})"


class Part:
    """Represents a musical part (instrument) within a measure."""

    def __init__(self, part_id: str):
        self.part_id = part_id
        self.notes: List[Note] = []
        self.backups: List[int] = []
        self.forwards: List[int] = []

    def to_dict(self) -> Dict:
        """Convert part to dictionary representation."""
        return {
            'part_id': self.part_id,
            'notes': [note.to_dict() for note in self.notes],
            'backups': self.backups,
            'forwards': self.forwards
        }

    def __repr__(self) -> str:
        return f"Part(id={self.part_id}, notes={len(self.notes)})"


class Measure:
    """Represents a complete musical measure with all parts."""

    def __init__(self, number: int):
        self.number = number
        self.parts: Dict[str, Part] = {}

    def add_part(self, part: Part):
        """Add a part to this measure."""
        self.parts[part.part_id] = part

    def get_part(self, part_id: str) -> Optional[Part]:
        """Get a specific part by ID."""
        return self.parts.get(part_id)

    def to_dict(self) -> Dict:
        """Convert measure to dictionary representation."""
        return {
            'measure_number': self.number,
            'parts': {part_id: part.to_dict() for part_id, part in self.parts.items()}
        }

    def to_json(self, indent: int = 2) -> str:
        """Convert measure to JSON string."""
        return json.dumps(self.to_dict(), indent=indent)

    def __repr__(self) -> str:
        return f"Measure(number={self.number}, parts={list(self.parts.keys())})"


class MusicXMLMeasureParser:
    """Parser for MusicXML measure elements."""

    @staticmethod
    def parse_pitch(pitch_elem: ET.Element) -> Dict[str, Union[str, int]]:
        """Parse pitch element and extract step, alter, and octave."""
        pitch_data = {}

        step_elem = pitch_elem.find('step')
        if step_elem is not None and step_elem.text:
            pitch_data['step'] = step_elem.text

        alter_elem = pitch_elem.find('alter')
        if alter_elem is not None and alter_elem.text:
            pitch_data['alter'] = int(alter_elem.text)

        octave_elem = pitch_elem.find('octave')
        if octave_elem is not None and octave_elem.text:
            pitch_data['octave'] = int(octave_elem.text)

        return pitch_data

    @staticmethod
    def parse_dynamics(note_elem: ET.Element) -> Optional[str]:
        """Parse dynamics from note element."""
        # Check for dynamics attribute (non-standard but in user's XML)
        dynamics_attr = note_elem.get('dynamics')
        if dynamics_attr:
            return dynamics_attr

        # Check for dynamics element in notations
        notations = note_elem.find('notations')
        if notations is not None:
            dynamics_elem = notations.find('dynamics')
            if dynamics_elem is not None:
                # Get the first child element's tag (pp, p, mp, mf, f, ff, fff)
                for child in dynamics_elem:
                    return child.tag

        # Check for direct dynamics child (alternative format)
        dynamics_elem = note_elem.find('dynamics')
        if dynamics_elem is not None and dynamics_elem.text:
            return dynamics_elem.text

        return None

    @staticmethod
    def parse_articulations(note_elem: ET.Element) -> List[str]:
        """Parse articulations from note element."""
        articulations = []

        # Check for articulations attribute (non-standard)
        artic_elem = note_elem.find('articulations')
        if artic_elem is not None:
            for child in artic_elem:
                articulations.append(child.tag)

        # Check for articulations in notations
        notations = note_elem.find('notations')
        if notations is not None:
            artic_elem = notations.find('articulations')
            if artic_elem is not None:
                for child in artic_elem:
                    articulations.append(child.tag)

        return articulations

    @staticmethod
    def parse_technical(note_elem: ET.Element) -> List[Dict[str, str]]:
        """Parse technical notations (bowings, fingerings, etc.)."""
        technical_list = []

        notations = note_elem.find('notations')
        if notations is not None:
            technical_elem = notations.find('technical')
            if technical_elem is not None:
                for child in technical_elem:
                    tech_data = {'notation': child.tag}

                    # Get attributes
                    for attr_name, attr_value in child.attrib.items():
                        tech_data[attr_name] = attr_value

                    # Get text content if present
                    if child.text:
                        tech_data['value'] = child.text

                    technical_list.append(tech_data)

        return technical_list

    @staticmethod
    def parse_ornaments(note_elem: ET.Element) -> List[Dict[str, str]]:
        """Parse ornamental notations (trills, tremolos, etc.)."""
        ornaments_list = []

        notations = note_elem.find('notations')
        if notations is not None:
            ornaments_elem = notations.find('ornaments')
            if ornaments_elem is not None:
                for child in ornaments_elem:
                    ornament_data = {'notation': child.tag}

                    # Get attributes
                    for attr_name, attr_value in child.attrib.items():
                        ornament_data[attr_name] = attr_value

                    # Get text content if present
                    if child.text:
                        ornament_data['value'] = child.text

                    ornaments_list.append(ornament_data)

        return ornaments_list

    @staticmethod
    def parse_lyrics(note_elem: ET.Element) -> List[str]:
        """Parse lyrics from note element."""
        lyrics = []

        for lyric_elem in note_elem.findall('lyric'):
            text_elem = lyric_elem.find('text')
            if text_elem is not None and text_elem.text:
                lyrics.append(text_elem.text)

        return lyrics

    @staticmethod
    def parse_note(note_elem: ET.Element) -> Note:
        """Parse a single note element."""
        note = Note()

        # Check if this is a chord note
        chord_elem = note_elem.find('chord')
        note.is_chord = chord_elem is not None

        # Check if this is a rest
        rest_elem = note_elem.find('rest')
        note.is_rest = rest_elem is not None

        # Parse pitch (if not a rest)
        if not note.is_rest:
            pitch_elem = note_elem.find('pitch')
            if pitch_elem is not None:
                note.pitch = MusicXMLMeasureParser.parse_pitch(pitch_elem)

        # Parse duration
        duration_elem = note_elem.find('duration')
        if duration_elem is not None and duration_elem.text:
            note.duration = int(duration_elem.text)

        # Parse note type (whole, half, quarter, etc.)
        type_elem = note_elem.find('type')
        if type_elem is not None and type_elem.text:
            note.note_type = type_elem.text

        # Parse dynamics
        note.dynamics = MusicXMLMeasureParser.parse_dynamics(note_elem)

        # Parse articulations
        note.articulations = MusicXMLMeasureParser.parse_articulations(note_elem)

        # Parse technical notations
        note.technical = MusicXMLMeasureParser.parse_technical(note_elem)

        # Parse ornaments
        note.ornaments = MusicXMLMeasureParser.parse_ornaments(note_elem)

        # Parse lyrics
        note.lyrics = MusicXMLMeasureParser.parse_lyrics(note_elem)

        return note

    @staticmethod
    def parse_part(part_elem: ET.Element) -> Part:
        """Parse a part element within a measure."""
        part_id = part_elem.get('id', 'unknown')
        part = Part(part_id)

        for child in part_elem:
            if child.tag == 'note':
                note = MusicXMLMeasureParser.parse_note(child)
                part.notes.append(note)

            elif child.tag == 'backup':
                duration_elem = child.find('duration')
                if duration_elem is not None and duration_elem.text:
                    part.backups.append(int(duration_elem.text))

            elif child.tag == 'forward':
                duration_elem = child.find('duration')
                if duration_elem is not None and duration_elem.text:
                    part.forwards.append(int(duration_elem.text))

        return part

    @staticmethod
    def parse_measure(measure_elem: ET.Element) -> Measure:
        """Parse a complete measure element."""
        measure_number = measure_elem.get('number')
        if measure_number:
            measure_number = int(measure_number)
        else:
            measure_number = 0

        measure = Measure(measure_number)

        for part_elem in measure_elem.findall('part'):
            part = MusicXMLMeasureParser.parse_part(part_elem)
            measure.add_part(part)

        return measure

    @staticmethod
    def parse_from_string(xml_string: str) -> List[Measure]:
        """
        Parse MusicXML measures from a string.

        Auto-detects the format:
        - Partwise format: <score-partwise><part><measure>...</measure></part></score-partwise>
        - Measurewise format: <measure><part>...</part></measure>
        """
        # Add root element if not present
        if not xml_string.strip().startswith('<?xml'):
            xml_string = '<?xml version="1.0"?>\n<root>\n' + xml_string + '\n</root>'

        try:
            root = ET.fromstring(xml_string)
        except ET.ParseError as e:
            raise ValueError(f"Failed to parse XML: {e}")

        # Check if this is a partwise score
        score_partwise = root.find('.//score-partwise')
        if score_partwise is not None:
            return MusicXMLMeasureParser.parse_partwise_score(score_partwise)

        # Otherwise, look for measures that directly contain parts (measurewise format)
        measures = []

        # Find all measure elements
        for measure_elem in root.findall('.//measure'):
            # Check if this measure has part children (measurewise format)
            if measure_elem.find('part') is not None:
                measure = MusicXMLMeasureParser.parse_measure(measure_elem)
                measures.append(measure)
            # If no parts found, it might be inside a part element (partwise format)
            # which should have been handled above

        # If we still have no measures, try partwise parsing from root
        if not measures and root.find('.//part[@id]') is not None:
            return MusicXMLMeasureParser.parse_partwise_score(root)

        return measures

    @staticmethod
    def parse_from_file(file_path: str) -> List[Measure]:
        """Parse MusicXML measures from a file."""
        with open(file_path, 'r', encoding='utf-8') as f:
            xml_content = f.read()

        return MusicXMLMeasureParser.parse_from_string(xml_content)

    @staticmethod
    def parse_partwise_score(root: ET.Element) -> List[Measure]:
        """
        Parse a standard MusicXML partwise score format.

        In partwise format, the structure is:
        <score-partwise>
          <part id="P1">
            <measure number="1">
              <note>...</note>
            </measure>
          </part>
        </score-partwise>

        This method reorganizes the data to be grouped by measure number.
        """
        measures_dict: Dict[int, Measure] = {}

        # Find all parts in the score
        for part_elem in root.findall('.//part[@id]'):
            part_id = part_elem.get('id', 'unknown')

            # Process each measure in this part
            for measure_elem in part_elem.findall('measure'):
                measure_number = measure_elem.get('number')
                if measure_number:
                    measure_number = int(measure_number)
                else:
                    measure_number = 0

                # Get or create the measure
                if measure_number not in measures_dict:
                    measures_dict[measure_number] = Measure(measure_number)

                measure = measures_dict[measure_number]

                # Create a part for this measure
                part = Part(part_id)

                # Parse all notes, backups, and forwards in this measure
                for child in measure_elem:
                    if child.tag == 'note':
                        note = MusicXMLMeasureParser.parse_note(child)
                        part.notes.append(note)

                    elif child.tag == 'backup':
                        duration_elem = child.find('duration')
                        if duration_elem is not None and duration_elem.text:
                            part.backups.append(int(duration_elem.text))

                    elif child.tag == 'forward':
                        duration_elem = child.find('duration')
                        if duration_elem is not None and duration_elem.text:
                            part.forwards.append(int(duration_elem.text))

                # Add the part to the measure
                measure.add_part(part)

        # Convert to sorted list
        measures_list = [measures_dict[num] for num in sorted(measures_dict.keys())]
        return measures_list


def main():
    """Example usage and testing."""

    # Example: Parse the measure 16 from KALLYNI
    example_measure = """
    <measure number="16">

      <part id="P1">
        <note>
          <pitch><step>E</step><octave>7</octave></pitch>
          <duration>4</duration>
          <type>whole</type>
          <dynamics>fff</dynamics>
          <articulations><accent/></articulations>
        </note>
      </part>

      <part id="P3">
        <note>
          <chord/>
          <pitch><step>A</step><octave>4</octave></pitch>
          <dynamics>ff</dynamics>
          <notations>
            <technical>
              <bowing type="sul ponticello"/>
            </technical>
            <ornaments><tremolo type="start"/></ornaments>
          </notations>
        </note>
        <note>
          <pitch><step>C</step><alter>1</alter><octave>5</octave></pitch>
        </note>
        <note>
          <pitch><step>E</step><octave>5</octave></pitch>
        </note>
        <backup><duration>4</duration></backup>
      </part>

      <part id="P5">
        <note>
          <pitch><step>D</step><octave>4</octave></pitch>
          <dynamics>ff</dynamics>
          <lyric><text>Ah</text></lyric>
        </note>
        <backup><duration>4</duration></backup>
      </part>

    </measure>
    """

    print("=" * 70)
    print("MusicXML Measure Parser - KALLYNI Project")
    print("=" * 70)
    print()

    # Parse the measure
    measures = MusicXMLMeasureParser.parse_from_string(example_measure)

    print(f"Parsed {len(measures)} measure(s)")
    print()

    for measure in measures:
        print(f"\n{measure}")
        print("-" * 70)

        for part_id, part in measure.parts.items():
            print(f"\n  {part}")

            # Get instrument name
            instrument_names = {
                'P1': 'Flauta (Flute)',
                'P2': 'Oboé (Oboe)',
                'P3': 'Violino (Violin)',
                'P4': 'Viola',
                'P5': 'Coro (Choir)',
                'P6': 'Harpa (Harp)'
            }
            instrument = instrument_names.get(part_id, 'Unknown')
            print(f"  Instrument: {instrument}")

            for i, note in enumerate(part.notes, 1):
                print(f"    Note {i}: {note}")

                # Print additional details
                if note.technical:
                    print(f"      Technical: {note.technical}")
                if note.ornaments:
                    print(f"      Ornaments: {note.ornaments}")
                if note.lyrics:
                    print(f"      Lyrics: {note.lyrics}")

            if part.backups:
                print(f"    Backups: {part.backups}")
            if part.forwards:
                print(f"    Forwards: {part.forwards}")

        print()
        print("-" * 70)
        print("\nJSON Representation:")
        print("-" * 70)
        print(measure.to_json())
        print()


if __name__ == '__main__':
    main()
