import numpy as np
# fix opencv open webcam slowly bug in WIN10
import os
os.environ["OPENCV_VIDEOIO_MSMF_ENABLE_HW_TRANSFORMS"] = "0"
from cv2 import cv2
import cv2


def load_img(path):
    img = cv2.imread(path)
    return img, img.shape

def img_show(imgs, ratio=1.0, name="Image"):
    for i, img in enumerate(imgs):
        img = cv2.resize(img, (0,0), fx=ratio, fy=ratio)
        cv2.imshow(name+str(i), img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def edge_detection(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (3, 3), 0)
    edged = cv2.Canny(blur, 100, 150)
    return edged

if __name__ == "__main__":
    # img
    path = './dartboard_pic/darts/1.jpg' # Demo 0_7.jpg
    img, info = load_img(path)

    kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]], np.float32)  # 锐化
    img = cv2.filter2D(img, -1, kernel=kernel)

    kernel = np.ones((3, 3), np.uint8)
    img = cv2.erode(img, kernel, iterations=1)

    img_show([img],10)

    # # video
    # # path = './dartboard_pic/new_960_720/0_v.mp4'
    # # cap = cv2.VideoCapture(path)
    # cap = cv2.VideoCapture(0)
    #
    # while(True):
    #     # 從攝影機擷取一張影像
    #     ret, img = cap.read()
    #
    #     fig = get_position_correction_fig(img)
    #     # 顯示圖片
    #     cv2.imshow('frame', fig)
    #
    #     # 若按下 q 鍵則離開迴圈
    #     if cv2.waitKey(10) & 0xFF == ord('q'):
    #         break
    #
    # # 釋放攝影機
    # cap.release()
    #
    # # 關閉所有 OpenCV 視窗
    # cv2.destroyAllWindows()

