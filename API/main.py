import numpy as np
import time
import threading
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydub import AudioSegment
from pydub.playback import play
from pydantic import BaseModel
import sounddevice as sd
import asyncio
import uvicorn

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins= origins,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

# 音量データ周りの処理.
class VolumeData(BaseModel):
    mic0: float
    mic1: float
    mic2: float
    mic3: float
    mic4: float
    mic5: float

class dbData(BaseModel):
    db0: float
    db1: float
    db2: float
    db3: float
    db4: float
    db5: float

sum_db = 0.01
db_init = 20 * np.log10(sum_db * (1/6))

current_volume:dbData = dbData(db0= db_init,
                               db1= db_init,
                               db2= db_init,
                               db3= db_init,
                               db4= db_init,
                               db5= db_init
                               )
print(current_volume)

def get_db(data: VolumeData):
    total_volume = data.mic0 + data.mic1 + data.mic2 + data.mic3 + data.mic4 + data.mic5
    dbs = list(map(lambda i: (20 * np.log10(sum_db * (getattr(data, f"mic{i}")/total_volume)) + 50), range(6)))
    return dbs #これはdbです.

@app.post('/volume')
async def adjust_volume(data: VolumeData):
    global current_volume
    current_volume = get_db(data) # 音量設定を更新
    # print(f"Volume adjusted: {current_volume}")
    return {
        "status": "success",
        "message": "Volume adjusted successfully",
        "volume": current_volume
        }


audio_files = ["audio_1.mp3",
               "audio_2.mp3",
               "audio_3.mp3",
               "piano.mp3",
               "guitar.mp3",
               "japan.mp3"
               ]

# audio_files = ["demo_241121_mic0.WAV",
#                "demo_241121_mic1.WAV",
#                "demo_241121_mic2.WAV",
#                "demo_241121_mic3.WAV",
#                "demo_241121_mic4.WAV",
#                "demo_241121_mic5.WAV"
#                ]


audio_list = list(map(AudioSegment.from_file, audio_files))

# 音量調整の関数
def adjust_volume(audio, gain_db: float):
    return audio + gain_db

flags = [False, False, False, False, False, False]

def stream_audio(i, data: VolumeData):
    global current_volume
    global flags
    current_volume = get_db(data)
    print(current_volume)
    audio = audio_list[i]
    samplerate = audio.frame_rate
    volume = current_volume[i]
    
    # チャンクサイズを100ms（0.1秒）に設定
    chunk_size = int(samplerate * 0.1)  # サンプル数
    audio_array = np.array(audio.get_array_of_samples())
    
    # モノラル用にリシェイプ
    if audio.channels > 1:
        audio_array = audio_array.reshape((-1, audio.channels))[:, 0]
    
    # 出力ストリームを作成
    stream = sd.OutputStream(samplerate=samplerate, channels=1, dtype='int16')
    stream.start()
    
    # チャンクごとに再生
    start = 0
    while flags[i] & (start < len(audio_array)):
        end = start + chunk_size
        chunk = audio_array[start:end]
        # 音量を調整
        adjusted_audio = adjust_volume(AudioSegment(chunk.tobytes(), frame_rate=samplerate, sample_width=2, channels=1), volume)
        adjusted_array = np.array(adjusted_audio.get_array_of_samples())
        # ストリームに書き込む
        stream.write(adjusted_array)
        if current_volume[i] != volume:
            volume = current_volume[i]
        start += chunk_size

    print(f"Stopped audio: {i}")

@app.post("/play")
async def start_playing(data: VolumeData):
    global flags
    if not any(flags):
        flags = [True, True, True, True, True, True]
        for idx, file in enumerate(audio_files):
            threading.Thread(target=stream_audio, args=(idx, data, )).start()
        return {"status": "success", "message": "Audio started playing"}
    else:
        return {"status": "error", "message": "Audio is already playing"}

@app.post("/stop")
async def stop_playing():
    global flags
    for i in range(len(flags)):
        flags[i] = False
    return {"status": "success", "message": "Audio stopped"}

# リアルタイムで音声を再生するための処理.
samplerate = 44100
channels = 1

def callback(indata, outdata, frames, time, status):
    if status:
        print(status)
    # インプットデータをそのままアウトプットデータにコピー
    outdata[:] = indata

async def play_audio():
    # 非同期で実行するためにストリームを別スレッドで開始
    with sd.Stream(samplerate=samplerate, channels=channels, callback=callback):
        print("Playing environment audio")
        await asyncio.sleep(5)  # 非同期スリープで10秒間再生


@app.post("/play/environment") 
async def play_environment():
    # 非同期タスクとしてplay_audioを実行
    await play_audio()
    return {"message": "Environment audio is playing"}


# #これでモニタリング・値の変更ができます.
# def monitor_data(data: VolumeData):
#     current_data = data.mic1
#     while True:
#         new_data = mic_data
#         if new_data != current_data:
#             current_data = new_data
#         print(f"Monitoring data: {current_data}")
#         time.sleep(1)

# @app.post("/monitor")
# async def monitor(data: VolumeData):
#     global mic_data
#     mic_data = data.mic1
#     threading.Thread(target=monitor_data, args=(data,)).start()
#     return {"status": "success", "message": "Monitoring started"}

# @app.post("/monitor/data")
# async def set_data(data: VolumeData):
#     print(data)
#     print(type(data))
#     print(data.mic1)
#     global mic_data
#     mic_data = data.mic1
#     return {"status": "success", "message": "Data received"}


if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)