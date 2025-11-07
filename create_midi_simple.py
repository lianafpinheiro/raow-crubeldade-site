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
    flauta_notes = [
        (64, 0, 1920),    # E5 - 4 beats
        (66, 1920, 960),  # F#5 - 2 beats
        (68, 2880, 960),  # G#5 - 2 beats
        (69, 3840, 1920), # A5 - 4 beats
        (71, 5760, 1920), # B5 - 4 beats
        (73, 7680, 1920), # C#6 - 4 beats
        (74, 9600, 1920), # D6 - 4 beats
        (76, 11520, 1920),# E6 - 4 beats (CLÍMAX)
        (74, 13440, 960), # D6 - 2 beats
        (73, 14400, 960), # C#6 - 2 beats
        (71, 15360, 1920),# B5 - 4 beats
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
        (61, 0, 1920),
        (62, 1920, 1920),
        (64, 3840, 1920),
        (66, 5760, 1920),
        (68, 7680, 1920),
        (69, 9600, 1920),
        (73, 11520, 1920),
        (71, 13440, 1920),
        (69, 15360, 1920),
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
        (57, 0, 1920),
        (59, 1920, 1920),
        (61, 3840, 1920),
        (62, 5760, 1920),
        (64, 7680, 1920),
        (66, 9600, 1920),
        (69, 11520, 1920),
        (68, 13440, 1920),
        (64, 15360, 1920),
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
        (52, 0, 1920),
        (54, 1920, 1920),
        (56, 3840, 1920),
        (57, 5760, 1920),
        (59, 7680, 1920),
        (61, 9600, 1920),
        (62, 11520, 1920),
        (61, 13440, 1920),
        (57, 15360, 1920),
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
        (57, 5760, 1920),
        (59, 7680, 1920),
        (61, 9600, 1920),
        (62, 11520, 1920),
        (64, 13440, 1920),
        (61, 15360, 1920),
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
        (64, 1920, 240),
        (69, 4800, 240),
        (73, 7680, 240),
        (69, 12480, 240),
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
print(f"⏱️  Duração: ~40 segundos")
print(f"🎼 Tonalidade: Lá Maior")
print(f"🎹 Tempo: 60 BPM")
print(f"📦 Tamanho: {len(midi_content)} bytes")
