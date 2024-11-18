from pydub import AudioSegment
from pydub.playback import play

# 音源ファイルのパスを指定します
audio_files = ["audio_1.mp3", "audio_2.mp3"]

# 最初の音源を読み込みます
combined_audio = AudioSegment.from_file(audio_files[0])

# 残りの音源を順次合成します
for file in audio_files[1:]:
    audio = AudioSegment.from_file(file)
    combined_audio = combined_audio.overlay(audio)  # オーバーレイして合成



# 合成した音源を再生します
play(combined_audio)
