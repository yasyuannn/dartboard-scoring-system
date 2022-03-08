import numpy as np
# fix opencv open webcam slowly bug in WIN10
import os
os.environ["OPENCV_VIDEOIO_MSMF_ENABLE_HW_TRANSFORMS"] = "0"
from cv2 import cv2
import cv2
import time


def load_img(path):
    img = cv2.imread(path)
    return img, img.shape

def img_show(imgs, ratio=1.0, name="Image"):
    for i, img in enumerate(imgs):
        img = cv2.resize(img, (0,0), fx=ratio, fy=ratio)
        cv2.imshow(name+str(i), img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def pos_cor(img, pts1, R=800):
    """
    :param img:
    :param pts1:  [Left Upper, Right Upper, Right Lower, Left Lower]
    :param R:
    :return:
    """
    pts2 = np.float32([[0, 0], [R, 0], [R, R], [0, R]])
    M = cv2.getPerspectiveTransform(pts1, pts2)
    dst = cv2.warpPerspective(img, M, (R, R))
    return dst

def edge_detection(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (3, 3), 0)
    edged = cv2.Canny(blur, 100, 150)
    return edged

qrDecoder = cv2.QRCodeDetector()

def get_position_correction_point(img):
    isQrcode, points = qrDecoder.detect(img)
    if isQrcode:
        return True, np.float32(points[0])
    else:
        return False, 0


def get_position_correction_fig(img):
    ok, pts1 = get_position_correction_point(img)
    if ok:
        img_pc = pos_cor(img, pts1)
        # gray = cv2.cvtColor(img_pc, cv2.COLOR_BGR2GRAY)
        img_edge = edge_detection(img_pc)
        # cv2.imwrite('Demo3.jpg', img_edge)
        # img_show([img, img_pc, img_edge])

        try:
            circles = cv2.HoughCircles(img_edge, cv2.HOUGH_GRADIENT, 1, 800, param1=100, param2=10, minRadius=300,
                                        maxRadius=400)[0, :, :]
            circles = np.uint16(np.around(circles))  # 四捨五入，取整
            # print(circles)
            i = circles[0]
            # print(i)
            # cv2.circle(img_pc, (i[0], i[1]), i[2], (0, 255, 0), 2)  # 畫圓
            # cv2.circle(img_pc, (i[0], i[1]), int(i[2]//1.17), (0, 255, 0), 2)  # 畫圓
            # cv2.circle(img_pc, (i[0], i[1]), int(i[2] // 1.25), (0, 255, 0), 2)  # 畫圓
            # cv2.circle(img_pc, (i[0], i[1]), int(i[2] // 1.83), (0, 255, 0), 2)  # 畫圓
            # cv2.circle(img_pc, (i[0], i[1]), int(i[2] // 2.07), (0, 255, 0), 2)  # 畫圓
            # cv2.circle(img_pc, (i[0], i[1]), int(i[2] // 8.8), (0, 255, 0), 2)  # 畫圓
            # cv2.circle(img_pc, (i[0], i[1]), int(i[2] // 20), (0, 255, 0), 2)  # 畫圓
            # cv2.circle(img_pc, (i[0], i[1]), 1, (0, 255, 0), 5)  # 畫圓心

            j = int(i[2] // 1.17) / 140
            k = 500 * j
            r = int(k/2)
            # print(j,k,r)
            if k > 800:
                cons = cv2.copyMakeBorder(img_pc, r-i[1], r+i[1]-800, r-i[0], r+i[0]-800, cv2.BORDER_CONSTANT, value=(255,255,255))
                rs = cv2.resize(cons,(499,499))
                return rs
            else:
                crop_img = img_pc[i[0]-r:i[0]+r, i[1]-r:i[1]+r]
                rs = cv2.resize(crop_img, (499, 499))
                return rs

        except:
            pass
        return img
        # img_show([img_edge])
    else:
        return img


if __name__ == "__main__":
    import DAI
    st_time = time.time()


    # # img
    # path = './dartboard_pic/new_960_720/0_7.jpg' # Demo 0_7.jpg
    # img, info = load_img(path)
    # # print(img.shape)
    # _ = get_position_correction_fig(img)
    # print(_.shape)
    # img_show([_])

    # video
    path = "http://140.113.110.20:2000"
    cap = cv2.VideoCapture(path)
    # cap = cv2.VideoCapture(0)

    while(True):
        # 從攝影機擷取一張影像
        ret, img = cap.read()
        fig = get_position_correction_fig(img)

        # 顯示圖片
        # if (time.time() - st_time) > 1:
        #     print("Hi")
        #     st_time = time.time()
        #     DAI.upload(np.asarray(fig).tolist(), target='img')
        cv2.imshow('frame', fig)

        # 若按下 q 鍵則離開迴圈
        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

    # 釋放攝影機
    cap.release()

    # 關閉所有 OpenCV 視窗
    cv2.destroyAllWindows()







