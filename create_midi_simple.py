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

    # Notas da flauta (nota, tempo_inicio*480, duracao*480, velocity)
    # 17 medidas completas com dinâmicas aprimoradas
    flauta_notes = [
        (64, 0, 1920, 40),       # M1: E5 - 4 beats (pp)
        (66, 1920, 960, 45),     # M2: F#5 - 2 beats
        (68, 2880, 960, 50),     # M2: G#5 - 2 beats
        (69, 3840, 1920, 55),    # M3: A5 - 4 beats
        (71, 5760, 1920, 65),    # M4: B5 - 4 beats (mp)
        (73, 7680, 1920, 70),    # M5: C#6 - 4 beats
        (74, 9600, 1920, 80),    # M6: D6 - 4 beats (mf)
        (76, 11520, 1920, 95),   # M7: E6 - 4 beats (f)
        (78, 13440, 960, 100),   # M8: F#6 - 2 beats
        (80, 14400, 960, 105),   # M8: G#6 - 2 beats
        (81, 15360, 1920, 108),  # M9: A6 - 4 beats
        (83, 17280, 1920, 110),  # M10: B6 - 4 beats
        (85, 19200, 480, 115),   # M11: C#7 - 1 beat (accent)
        (83, 19680, 480, 112),   # M11: B6 - 1 beat
        (85, 20160, 480, 115),   # M11: C#7 - 1 beat
        (86, 20640, 480, 118),   # M11: D7 - 1 beat
        (88, 21120, 960, 120),   # M12: E7 - 2 beats
        (86, 22080, 960, 118),   # M12: D7 - 2 beats
        (85, 23040, 1920, 115),  # M13: C#7 - 4 beats
        (83, 24960, 960, 113),   # M14: B6 - 2 beats
        (81, 25920, 960, 115),   # M14: A6 - 2 beats
        # M15: Crescendo dramático com tremolo
        (80, 26880, 240, 117),   # G#6 tremolo start
        (80, 27120, 240, 120),
        (80, 27360, 240, 122),
        (80, 27600, 240, 125),
        (80, 27840, 240, 127),
        (80, 28080, 240, 127),
        (80, 28320, 240, 127),
        (80, 28560, 240, 127),
        # M16: CLÍMAX fff com articulações poderosas
        (88, 28800, 240, 127),   # E7 - tremolo fff
        (90, 29040, 240, 127),   # F#7
        (88, 29280, 240, 127),   # E7
        (90, 29520, 240, 127),   # F#7
        (88, 29760, 960, 127),   # E7 sustentado
        (90, 30720, 480, 127),   # F#7 final accent
        # M17: Morendo
        (86, 31200, 960, 35),    # D7 - 2 beats (p - Morendo)
    ]

    last_time = 0
    for note, start_time, duration, velocity in flauta_notes:
        delta = start_time - last_time
        track0 += write_var_len(delta) + bytes([0x90, note, velocity])  # Note ON
        track0 += write_var_len(duration) + bytes([0x80, note, 0])      # Note OFF
        last_time = start_time + duration

    track0 += write_var_len(0) + b'\xFF\x2F\x00'  # End of track
    tracks.append(b'MTrk' + struct.pack('>I', len(track0)) + track0)

    # TRACK 1: Oboé (Programa 68)
    track1 = bytearray()
    track1 += b'\x00\xFF\x03\x04Obo\xC3\xA9'  # Track name
    track1 += b'\x00\xC1\x44'  # Program change: Oboé (68 = 0x44)

    oboe_notes = [
        (61, 0, 1920, 40),       # M1: C#5 (pp)
        (62, 1920, 1920, 45),    # M2: D5
        (64, 3840, 1920, 50),    # M3: E5
        (66, 5760, 1920, 65),    # M4: F#5 (mp)
        (68, 7680, 1920, 70),    # M5: G#5
        (69, 9600, 1920, 80),    # M6: A5 (mf)
        (71, 11520, 1920, 95),   # M7: B5 (f)
        (73, 13440, 1920, 100),  # M8: C#6
        (74, 15360, 1920, 108),  # M9: D6
        (76, 17280, 1920, 110),  # M10: E6
        (78, 19200, 960, 113),   # M11: F#6
        (76, 20160, 960, 110),   # M11: E6
        (74, 21120, 1920, 112),  # M12: D6
        (76, 23040, 1920, 113),  # M13: E6
        (78, 24960, 1920, 115),  # M14: F#6
        # M15: Crescendo dramático
        (80, 26880, 480, 118),   # G#6 crescendo
        (80, 27360, 480, 122),
        (80, 27840, 480, 125),
        (80, 28320, 480, 127),
        # M16: CLÍMAX fff com harmônicos ricos
        (85, 28800, 480, 127),   # C#7
        (87, 29280, 480, 127),   # D#7
        (85, 29760, 960, 127),   # C#7 sustentado
        # M17: Morendo
        (83, 30720, 960, 35),    # B6 (p)
    ]

    last_time = 0
    for note, start_time, duration, velocity in oboe_notes:
        delta = start_time - last_time
        track1 += write_var_len(delta) + bytes([0x91, note, velocity])
        track1 += write_var_len(duration) + bytes([0x81, note, 0])
        last_time = start_time + duration

    track1 += write_var_len(0) + b'\xFF\x2F\x00'
    tracks.append(b'MTrk' + struct.pack('>I', len(track1)) + track1)

    # TRACK 2: Violino (Programa 40)
    track2 = bytearray()
    track2 += b'\x00\xFF\x03\x07Violino'
    track2 += b'\x00\xC2\x28'  # Program change: Violino (40 = 0x28)

    violino_notes = [
        (57, 0, 1920, 40),       # M1: A4 (pp)
        (59, 1920, 1920, 45),    # M2: B4
        (61, 3840, 1920, 50),    # M3: C#5
        (62, 5760, 1920, 65),    # M4: D5 (mp)
        (64, 7680, 1920, 70),    # M5: E5
        (66, 9600, 1920, 80),    # M6: F#5 (mf)
        (68, 11520, 1920, 95),   # M7: G#5 (f)
        (69, 13440, 1920, 100),  # M8: A5
        (71, 15360, 1920, 108),  # M9: B5
        (73, 17280, 1920, 110),  # M10: C#6
        (74, 19200, 1920, 112),  # M11: D6
        (76, 21120, 1920, 115),  # M12: E6
        (78, 23040, 1920, 117),  # M13: F#6
        (80, 24960, 1920, 120),  # M14: G#6
        # M15: Tremolo crescendo
        (81, 26880, 120, 122),   # A6 tremolo rápido
        (81, 27000, 120, 123),
        (81, 27120, 120, 124),
        (81, 27240, 120, 125),
        (81, 27360, 120, 126),
        (81, 27480, 120, 127),
        (81, 27600, 120, 127),
        (81, 27720, 120, 127),
        (81, 27840, 120, 127),
        (81, 27960, 120, 127),
        (81, 28080, 120, 127),
        (81, 28200, 120, 127),
        (81, 28320, 120, 127),
        (81, 28440, 120, 127),
        (81, 28560, 120, 127),
        (81, 28680, 120, 127),
        # M16: CLÍMAX - Acordes poderosos fff
        (57, 28800, 1920, 127),  # A4 (fff)
        (61, 28800, 1920, 127),  # C#5 (sobreposto)
        (64, 28800, 1920, 127),  # E5 (sobreposto)
        (69, 28800, 1920, 127),  # A5 (dobramento)
        # M17: Morendo
        (62, 30720, 960, 35),    # D5 (p - Morendo)
    ]

    last_time = 0
    for note, start_time, duration, velocity in violino_notes:
        delta = start_time - last_time
        track2 += write_var_len(delta) + bytes([0x92, note, velocity])
        track2 += write_var_len(duration) + bytes([0x82, note, 0])
        last_time = start_time + duration

    track2 += write_var_len(0) + b'\xFF\x2F\x00'
    tracks.append(b'MTrk' + struct.pack('>I', len(track2)) + track2)

    # TRACK 3: Viola (Programa 41)
    track3 = bytearray()
    track3 += b'\x00\xFF\x03\x05Viola'
    track3 += b'\x00\xC3\x29'  # Program change: Viola (41 = 0x29)

    viola_notes = [
        (52, 0, 1920, 40),       # M1: E4 (pp)
        (54, 1920, 1920, 45),    # M2: F#4
        (56, 3840, 1920, 50),    # M3: G#4
        (57, 5760, 1920, 65),    # M4: A4 (mp)
        (59, 7680, 1920, 70),    # M5: B4
        (61, 9600, 1920, 80),    # M6: C#5 (mf)
        (62, 11520, 1920, 95),   # M7: D5 (f)
        (64, 13440, 1920, 100),  # M8: E5
        (66, 15360, 1920, 108),  # M9: F#5
        (68, 17280, 1920, 110),  # M10: G#5
        (69, 19200, 1920, 112),  # M11: A5
        (71, 21120, 1920, 115),  # M12: B5
        (73, 23040, 1920, 117),  # M13: C#6
        (74, 24960, 1920, 120),  # M14: D6
        # M15: Tremolo crescendo
        (76, 26880, 120, 122),   # E6 tremolo
        (76, 27000, 120, 123),
        (76, 27120, 120, 124),
        (76, 27240, 120, 125),
        (76, 27360, 120, 126),
        (76, 27480, 120, 127),
        (76, 27600, 120, 127),
        (76, 27720, 120, 127),
        (76, 27840, 120, 127),
        (76, 27960, 120, 127),
        (76, 28080, 120, 127),
        (76, 28200, 120, 127),
        (76, 28320, 120, 127),
        (76, 28440, 120, 127),
        (76, 28560, 120, 127),
        (76, 28680, 120, 127),
        # M16: CLÍMAX - Acorde D4-F#4-A4 (fff)
        (50, 28800, 1920, 127),  # D4
        (54, 28800, 1920, 127),  # F#4
        (57, 28800, 1920, 127),  # A4
        (62, 28800, 1920, 127),  # D5 (dobramento)
        # M17: Morendo
        (52, 30720, 960, 30),    # E4 (ppp)
    ]

    last_time = 0
    for note, start_time, duration, velocity in viola_notes:
        delta = start_time - last_time
        track3 += write_var_len(delta) + bytes([0x93, note, velocity])
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
        (57, 5760, 1920, 65),    # M4: A4 (mp) "Ah"
        (59, 7680, 1920, 70),    # M5: B4
        (61, 9600, 1920, 80),    # M6: C#5 (mf)
        (62, 11520, 1920, 95),   # M7: D5 (f) "Ah"
        (64, 13440, 1920, 100),  # M8: E5
        (66, 15360, 1920, 108),  # M9: F#5
        (68, 17280, 1920, 110),  # M10: G#5
        (69, 19200, 1920, 112),  # M11: A5
        (71, 21120, 1920, 115),  # M12: B5
        (73, 23040, 1920, 117),  # M13: C#6
        (74, 24960, 1920, 120),  # M14: D6
        # M15: Crescendo poderoso
        (76, 26880, 480, 123),   # E6 crescendo
        (76, 27360, 480, 125),
        (76, 27840, 480, 127),
        (76, 28320, 480, 127),
        # M16: CLÍMAX - Acorde completo fff "AH!"
        (50, 28800, 1920, 127),  # D4 (Baixo)
        (54, 28800, 1920, 127),  # F#4 (Tenor)
        (57, 28800, 1920, 127),  # A4 (Alto)
        (62, 28800, 1920, 127),  # D5 (Soprano)
        (66, 28800, 1920, 127),  # F#5 (Soprano alto)
        # M17: Acorde E4-G#4-B4 (ppp) Angelical
        (52, 30720, 960, 25),    # E4
        (56, 30720, 960, 25),    # G#4
        (59, 30720, 960, 25),    # B4
    ]

    last_time = 0
    for note, start_time, duration, velocity in coro_notes:
        delta = start_time - last_time
        track4 += write_var_len(delta) + bytes([0x94, note, velocity])
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
        (64, 1920, 240, 40),     # M2: E5 - quarter (pp)
        (69, 4800, 240, 45),     # M3: A5 - quarter (no meio da medida)
        # M4: Tacet
        (73, 7680, 240, 70),     # M5: C#6 - quarter (mp)
        # M6: Tacet
        (69, 11520, 240, 80),    # M7: A5 - quarter (no meio da medida) (mf)
        # M8: Tacet
        (76, 15840, 240, 95),    # M9: E6 - quarter (após 1 beat) (f)
        # M10: Tacet
        (85, 20160, 60, 115),    # M11: C#7 - 16th staccato (no meio)
        # M12-M13: Tacet
        (81, 24960, 60, 118),    # M14: A6 - 16th staccato
        # M15: Glissando ascendente dramático (preparação para o clímax)
        (50, 26880, 60, 120),    # D4 - glissando rápido
        (54, 26940, 60, 122),    # F#4
        (57, 27000, 60, 124),    # A4
        (62, 27060, 60, 125),    # D5
        (66, 27120, 60, 126),    # F#5
        (69, 27180, 60, 127),    # A5
        (74, 27240, 60, 127),    # D6
        (78, 27300, 60, 127),    # F#6
        (81, 27360, 60, 127),    # A6
        (86, 27420, 60, 127),    # D7
        # M15 continuação: Arpejos rápidos
        (69, 27600, 80, 127),    # A5
        (74, 27680, 80, 127),    # D6
        (78, 27760, 80, 127),    # F#6
        (81, 27840, 80, 127),    # A6
        (86, 27920, 80, 127),    # D7
        (90, 28000, 80, 127),    # F#7
        (93, 28080, 80, 127),    # A7
        # M16: CLÍMAX - Acordes arpegiados poderosos fff
        (50, 28800, 40, 127),    # D4 - arpejo rápido do acorde
        (54, 28840, 40, 127),    # F#4
        (57, 28880, 40, 127),    # A4
        (62, 28920, 40, 127),    # D5
        (66, 28960, 40, 127),    # F#5
        (69, 29000, 40, 127),    # A5
        (74, 29040, 40, 127),    # D6
        (78, 29080, 40, 127),    # F#6
        (81, 29120, 1680, 127),  # A6 - sustentado até o final
        # M17: Glissando descendente angelical (morendo)
        (81, 30720, 60, 30),     # A6
        (78, 30780, 60, 28),     # F#6
        (74, 30840, 60, 26),     # D6
        (69, 30900, 60, 24),     # A5
        (64, 30960, 60, 22),     # E5
        (59, 31020, 60, 20),     # B4
    ]

    last_time = 0
    for note, start_time, duration, velocity in harpa_notes:
        delta = start_time - last_time
        track5 += write_var_len(delta) + bytes([0x95, note, velocity])
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
print(f"🔥 CLÍMAX APRIMORADO na medida 16:")
print(f"   - Crescendo dramático com tremolo em M15")
print(f"   - Glissandos e arpejos poderosos na harpa")
print(f"   - Dinâmicas expressivas (pp → fff)")
print(f"   - Acordes completos fff no clímax")
print(f"   - Resolução angelical (morendo) em M17")
print(f"📦 Tamanho: {len(midi_content)} bytes")
