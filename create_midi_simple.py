#!/usr/bin/env python3
"""
Gerador MIDI manual para "KALLYNI — O Céu Azul"
Escreve diretamente no formato MIDI sem bibliotecas externas
"""

import struct

def write_var_len(value):
    """Escreve um número de tamanho variável no formato MIDI"""
    result = bytearray()
    result.insert(0, value & 0x7F)
    value >>= 7
    while value > 0:
        result.insert(0, (value & 0x7F) | 0x80)
        value >>= 7
    return bytes(result)

def create_midi():
    # Header do arquivo MIDI
    # "MThd" + tamanho (6 bytes) + formato (1) + número de tracks (6) + divisão (480 ppqn)
    header = b'MThd' + struct.pack('>I', 6) + struct.pack('>HHH', 1, 6, 480)

    tracks = []

    # Configurações
    tempo_bpm = 60
    # Microsegundos por quarter note = 60,000,000 / BPM
    tempo_mpqn = int(60000000 / tempo_bpm)

    # TRACK 0: Flauta (Programa 73)
    track0 = bytearray()
    track0 += b'\x00\xFF\x03\x06Flauta'  # Track name
    track0 += b'\x00\xFF\x51\x03' + struct.pack('>I', tempo_mpqn)[1:]  # Tempo
    track0 += b'\x00\xC0\x49'  # Program change: Flauta (73 = 0x49)

    # Notas da flauta (nota, tempo_inicio*480, duracao*480)
    # 17 medidas completas
    flauta_notes = [
        (64, 0, 1920),      # M1: E5 - 4 beats (pp)
        (66, 1920, 960),    # M2: F#5 - 2 beats
        (68, 2880, 960),    # M2: G#5 - 2 beats
        (69, 3840, 1920),   # M3: A5 - 4 beats
        (71, 5760, 1920),   # M4: B5 - 4 beats (mp)
        (73, 7680, 1920),   # M5: C#6 - 4 beats
        (74, 9600, 1920),   # M6: D6 - 4 beats (mf)
        (76, 11520, 1920),  # M7: E6 - 4 beats (f)
        (78, 13440, 960),   # M8: F#6 - 2 beats
        (80, 14400, 960),   # M8: G#6 - 2 beats
        (81, 15360, 1920),  # M9: A6 - 4 beats
        (83, 17280, 1920),  # M10: B6 - 4 beats
        (85, 19200, 480),   # M11: C#7 - 1 beat (accent)
        (83, 19680, 480),   # M11: B6 - 1 beat
        (85, 20160, 480),   # M11: C#7 - 1 beat
        (86, 20640, 480),   # M11: D7 - 1 beat
        (88, 21120, 960),   # M12: E7 - 2 beats
        (86, 22080, 960),   # M12: D7 - 2 beats
        (85, 23040, 1920),  # M13: C#7 - 4 beats
        (83, 24960, 960),   # M14: B6 - 2 beats
        (81, 25920, 960),   # M14: A6 - 2 beats
        (80, 26880, 1920),  # M15: G#6 - 4 beats (ff)
        (88, 28800, 1920),  # M16: E7 - 4 beats (CLÍMAX fff)
        (86, 30720, 960),   # M17: D7 - 2 beats (p - Morendo)
    ]

    last_time = 0
    for note, start_time, duration in flauta_notes:
        delta = start_time - last_time
        track0 += write_var_len(delta) + bytes([0x90, note, 100])  # Note ON
        track0 += write_var_len(duration) + bytes([0x80, note, 0]) # Note OFF
        last_time = start_time + duration

    track0 += write_var_len(0) + b'\xFF\x2F\x00'  # End of track
    tracks.append(b'MTrk' + struct.pack('>I', len(track0)) + track0)

    # TRACK 1: Oboé (Programa 68)
    track1 = bytearray()
    track1 += b'\x00\xFF\x03\x04Obo\xC3\xA9'  # Track name
    track1 += b'\x00\xC1\x44'  # Program change: Oboé (68 = 0x44)

    oboe_notes = [
        (61, 0, 1920),      # M1: C#5 (pp)
        (62, 1920, 1920),   # M2: D5
        (64, 3840, 1920),   # M3: E5
        (66, 5760, 1920),   # M4: F#5 (mp)
        (68, 7680, 1920),   # M5: G#5
        (69, 9600, 1920),   # M6: A5 (mf)
        (71, 11520, 1920),  # M7: B5 (f)
        (73, 13440, 1920),  # M8: C#6
        (74, 15360, 1920),  # M9: D6
        (76, 17280, 1920),  # M10: E6
        (78, 19200, 960),   # M11: F#6
        (76, 20160, 960),   # M11: E6
        (74, 21120, 1920),  # M12: D6
        (76, 23040, 1920),  # M13: E6
        (78, 24960, 1920),  # M14: F#6
        (80, 26880, 1920),  # M15: G#6 (ff)
        (85, 28800, 1920),  # M16: C#7 (fff CLÍMAX)
        (83, 30720, 960),   # M17: B6 (p)
    ]

    last_time = 0
    for note, start_time, duration in oboe_notes:
        delta = start_time - last_time
        track1 += write_var_len(delta) + bytes([0x91, note, 100])
        track1 += write_var_len(duration) + bytes([0x81, note, 0])
        last_time = start_time + duration

    track1 += write_var_len(0) + b'\xFF\x2F\x00'
    tracks.append(b'MTrk' + struct.pack('>I', len(track1)) + track1)

    # TRACK 2: Violino (Programa 40)
    track2 = bytearray()
    track2 += b'\x00\xFF\x03\x07Violino'
    track2 += b'\x00\xC2\x28'  # Program change: Violino (40 = 0x28)

    violino_notes = [
        (57, 0, 1920),      # M1: A4 (pp)
        (59, 1920, 1920),   # M2: B4
        (61, 3840, 1920),   # M3: C#5
        (62, 5760, 1920),   # M4: D5 (mp)
        (64, 7680, 1920),   # M5: E5
        (66, 9600, 1920),   # M6: F#5 (mf)
        (68, 11520, 1920),  # M7: G#5 (f)
        (69, 13440, 1920),  # M8: A5
        (71, 15360, 1920),  # M9: B5
        (73, 17280, 1920),  # M10: C#6
        (74, 19200, 1920),  # M11: D6
        (76, 21120, 1920),  # M12: E6
        (78, 23040, 1920),  # M13: F#6
        (80, 24960, 1920),  # M14: G#6
        (81, 26880, 1920),  # M15: A6 (ff)
        # M16: CLÍMAX - Acorde A4-C#5-E5 com tremolo (simultâneo)
        (57, 28800, 1920),  # A4 (ff)
        (61, 28800, 1920),  # C#5 (sobreposto)
        (64, 28800, 1920),  # E5 (sobreposto)
        (62, 30720, 960),   # M17: D5 (p - Morendo)
    ]

    last_time = 0
    for note, start_time, duration in violino_notes:
        delta = start_time - last_time
        track2 += write_var_len(delta) + bytes([0x92, note, 100])
        track2 += write_var_len(duration) + bytes([0x82, note, 0])
        last_time = start_time + duration

    track2 += write_var_len(0) + b'\xFF\x2F\x00'
    tracks.append(b'MTrk' + struct.pack('>I', len(track2)) + track2)

    # TRACK 3: Viola (Programa 41)
    track3 = bytearray()
    track3 += b'\x00\xFF\x03\x05Viola'
    track3 += b'\x00\xC3\x29'  # Program change: Viola (41 = 0x29)

    viola_notes = [
        (52, 0, 1920),      # M1: E4 (pp)
        (54, 1920, 1920),   # M2: F#4
        (56, 3840, 1920),   # M3: G#4
        (57, 5760, 1920),   # M4: A4 (mp)
        (59, 7680, 1920),   # M5: B4
        (61, 9600, 1920),   # M6: C#5 (mf)
        (62, 11520, 1920),  # M7: D5 (f)
        (64, 13440, 1920),  # M8: E5
        (66, 15360, 1920),  # M9: F#5
        (68, 17280, 1920),  # M10: G#5
        (69, 19200, 1920),  # M11: A5
        (71, 21120, 1920),  # M12: B5
        (73, 23040, 1920),  # M13: C#6
        (74, 24960, 1920),  # M14: D6
        (76, 26880, 1920),  # M15: E6 (ff)
        # M16: CLÍMAX - Acorde D4-F#4-A4 (ff)
        (50, 28800, 1920),  # D4
        (54, 28800, 1920),  # F#4
        (57, 28800, 1920),  # A4
        # M17: Tacet
    ]

    last_time = 0
    for note, start_time, duration in viola_notes:
        delta = start_time - last_time
        track3 += write_var_len(delta) + bytes([0x93, note, 100])
        track3 += write_var_len(duration) + bytes([0x83, note, 0])
        last_time = start_time + duration

    track3 += write_var_len(0) + b'\xFF\x2F\x00'
    tracks.append(b'MTrk' + struct.pack('>I', len(track3)) + track3)

    # TRACK 4: Coro (Programa 52)
    track4 = bytearray()
    track4 += b'\x00\xFF\x03\x04Coro'
    track4 += b'\x00\xC4\x34'  # Program change: Coro (52 = 0x34)

    coro_notes = [
        # M1-M3: Tacet
        (57, 5760, 1920),   # M4: A4 (mp) "Ah"
        (59, 7680, 1920),   # M5: B4
        (61, 9600, 1920),   # M6: C#5 (mf)
        (62, 11520, 1920),  # M7: D5 (f) "Ah"
        (64, 13440, 1920),  # M8: E5
        (66, 15360, 1920),  # M9: F#5
        (68, 17280, 1920),  # M10: G#5
        (69, 19200, 1920),  # M11: A5
        (71, 21120, 1920),  # M12: B5
        (73, 23040, 1920),  # M13: C#6
        (74, 24960, 1920),  # M14: D6
        (76, 26880, 1920),  # M15: E6 (ff)
        # M16: CLÍMAX - Acorde D4-F#4-A4 (ff) "Ah"
        (50, 28800, 1920),  # D4
        (54, 28800, 1920),  # F#4
        (57, 28800, 1920),  # A4
        # M17: Acorde E4-G#4-B4 (ppp) Angelical
        (52, 30720, 960),   # E4
        (56, 30720, 960),   # G#4
        (59, 30720, 960),   # B4
    ]

    last_time = 0
    for note, start_time, duration in coro_notes:
        delta = start_time - last_time
        track4 += write_var_len(delta) + bytes([0x94, note, 100])
        track4 += write_var_len(duration) + bytes([0x84, note, 0])
        last_time = start_time + duration

    track4 += write_var_len(0) + b'\xFF\x2F\x00'
    tracks.append(b'MTrk' + struct.pack('>I', len(track4)) + track4)

    # TRACK 5: Harpa (Programa 46)
    track5 = bytearray()
    track5 += b'\x00\xFF\x03\x05Harpa'
    track5 += b'\x00\xC5\x2E'  # Program change: Harpa (46 = 0x2E)

    harpa_notes = [
        # M1: Tacet
        (64, 1920, 240),    # M2: E5 - quarter (pp)
        (69, 4800, 240),    # M3: A5 - quarter (no meio da medida)
        # M4: Tacet
        (73, 7680, 240),    # M5: C#6 - quarter (mp)
        # M6: Tacet
        (69, 11520, 240),   # M7: A5 - quarter (no meio da medida) (mf)
        # M8: Tacet
        (76, 15840, 240),   # M9: E6 - quarter (após 1 beat) (f)
        # M10: Tacet
        (85, 20160, 60),    # M11: C#7 - 16th staccato (no meio)
        # M12: Tacet
        (81, 26880, 60),    # M13: A6 - 16th staccato (após 3 beats)
        # M14-M15: Tacet
        (69, 28894, 10),    # M16: A5 - 16th staccatissimo (após tempo específico 47) (f)
        # M17: Tacet
    ]

    last_time = 0
    for note, start_time, duration in harpa_notes:
        delta = start_time - last_time
        track5 += write_var_len(delta) + bytes([0x95, note, 100])
        track5 += write_var_len(duration) + bytes([0x85, note, 0])
        last_time = start_time + duration

    track5 += write_var_len(0) + b'\xFF\x2F\x00'
    tracks.append(b'MTrk' + struct.pack('>I', len(track5)) + track5)

    # Combinar tudo
    midi_data = header + b''.join(tracks)

    return midi_data

# Gerar e salvar o arquivo MIDI
midi_content = create_midi()
output_file = "/home/user/raow-crubeldade-site/KALLYNI-O_Ceu_Azul.mid"

with open(output_file, "wb") as f:
    f.write(midi_content)

print(f"✅ Arquivo MIDI criado: {output_file}")
print(f"🎵 6 tracks: Flauta, Oboé, Violino, Viola, Coro, Harpa")
print(f"📏 17 medidas completas")
print(f"⏱️  Duração: ~68 segundos (1:08)")
print(f"🎼 Tonalidade: Lá Maior")
print(f"🎹 Tempo: 60 BPM")
print(f"🎺 CLÍMAX na medida 16 (0:45) com acordes fff")
print(f"📦 Tamanho: {len(midi_content)} bytes")
