import numpy as np
from cv2 import cv2

# cv2.getPerspectiveTransform()

def load_img(path):
    img = cv2.imread(path)
    return img, img.shape

def img_show(img, ratio=1.0, name="Image"):
    img = cv2.resize(img, (0,0), fx=ratio, fy=ratio)
    cv2.imshow(name, img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def pos_cor(img, pts1, R=500):
    """
    :param img:
    :param pts1:  [Left, Upper, Right, Lower]
    :param R:
    :return:
    """
    pts2 = np.float32([[R / 2, 0], [R, R / 2], [R / 2, R], [0, R / 2]])  # [Left, Upper, Right, Lower]
    M = cv2.getPerspectiveTransform(pts1, pts2)
    dst = cv2.warpPerspective(img, M, (R, R))
    return dst




path = './dartboard_pic/locate/5.jpg'

img, info = load_img(path)
print(img.shape)

# gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

pts1 = np.float32([[354, 93], [435, 270], [322, 430], [189, 249]])
img = pos_cor(img, pts1)


img_show(img)

