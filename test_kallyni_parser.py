#!/usr/bin/env python3
"""
Test the MusicXML parser with the KALLYNI MusicXML file.
"""

from parse_musicxml_measure import MusicXMLMeasureParser


def main():
    print("=" * 70)
    print("Testing KALLYNI MusicXML File Parser")
    print("=" * 70)
    print()

    # Parse the entire KALLYNI file
    measures = MusicXMLMeasureParser.parse_from_file('KALLYNI-O_Ceu_Azul.musicxml')

    print(f"Successfully parsed {len(measures)} measures from KALLYNI-O_Ceu_Azul.musicxml")
    print()

    # Display summary of all measures
    print("Measure Summary:")
    print("-" * 70)
    for measure in measures[:5]:  # Show first 5 measures
        print(f"Measure {measure.number}: {len(measure.parts)} parts")
        for part_id, part in measure.parts.items():
            instrument_names = {
                'P1': 'Flauta',
                'P2': 'Oboé',
                'P3': 'Violino',
                'P4': 'Viola',
                'P5': 'Coro',
                'P6': 'Harpa'
            }
            instrument = instrument_names.get(part_id, 'Unknown')
            print(f"  {part_id} ({instrument}): {len(part.notes)} notes")

    print()
    print("..." if len(measures) > 5 else "")
    print()

    # Show measure 16 (the climax) if it exists
    measure_16 = next((m for m in measures if m.number == 16), None)
    if measure_16:
        print("=" * 70)
        print("Measure 16 (Climax) - Detailed View")
        print("=" * 70)
        print()
        print(measure_16.to_json())
    else:
        print("Note: Measure 16 not found in the file")

    print()
    print("=" * 70)
    print("Test completed successfully!")
    print("=" * 70)


if __name__ == '__main__':
    main()
