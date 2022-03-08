import numpy as np
import os
os.environ["OPENCV_VIDEOIO_MSMF_ENABLE_HW_TRANSFORMS"] = "0"
from cv2 import cv2
import cv2
import position_correction as pc
import DAI

def __test(i,r,k,img_pc):
    if k > 800:
        cons = cv2.copyMakeBorder(img_pc, r - i[1], r + i[1] - 800, r - i[0], r + i[0] - 800,
                                  cv2.BORDER_CONSTANT, value=(0, 0, 0))
        rs = cv2.resize(cons, (499, 499))
        return rs
    else:
        crop_img = img_pc[i[0] - r:i[0] + r, i[1] - r:i[1] + r]
        rs = cv2.resize(crop_img, (499, 499))
        return rs

def locate(frame_read):
    i = j = k = r = 0
    is_true, points = pc.get_position_correction_point(frame_read)
    while not is_true:
        is_true, points = pc.get_position_correction_point(frame_read)
    try:
        img_pc = pc.pos_cor(frame_read, points)
        img_edge = pc.edge_detection(img_pc)
        circles = cv2.HoughCircles(img_edge, cv2.HOUGH_GRADIENT, 1, 800, param1=100, param2=10, minRadius=300,
                                   maxRadius=400)[0, :, :]
        circles = np.uint16(np.around(circles))  # 四捨五入，取整
        i = circles[0]
        j = int(i[2] // 1.17) / 140
        k = 500 * j
        r = int(k / 2)
        # print(j,k,r)
        return points, i, r, k
    except:
        print("locate ERROR")

def dart_transform(frame_read, darts, counter, points, i, r, k):
    ## org img darts point
    # for dart in darts:
    #     cv2.putText(frame_read, "X", (dart[0] - 10, dart[1] + 10), cv2.FONT_HERSHEY_SIMPLEX,
    #                 1, (0, 255, 0), 2)
    # cv2.imshow('frame', frame_read)

    tr = np.zeros([960, 720])
    tr[darts[1]][darts[0]] = 255

    pc_tr = pc.pos_cor(tr, points) # 960*720 -> 800*800
    img_pc = pc.pos_cor(frame_read, points)

    ## 800*800 point norm
    ind = np.unravel_index(np.argsort(pc_tr, axis=None), pc_tr.shape)
    darts_pc = np.where(pc_tr >= (pc_tr[ind][-1]))
    pc_tr = np.zeros([800, 800])
    pc_tr[darts_pc[1][0]][darts_pc[0][0]] = 255
    # print("A", darts_pc)


    imgsw = __test(i, r, k, img_pc) # 800*800 get center and resize to 499*499
    dartsw = __test(i, r, k, pc_tr)

    ind = np.unravel_index(np.argsort(dartsw, axis=None), dartsw.shape)
    pc_darts = np.where(dartsw >= (dartsw[ind][-1]))
    # print(pc_darts)

    upload_xy = [pc_darts[0][0], pc_darts[1][0]]
    # print(upload_xy)

    # ## pre upload img darts point
    # for _i in range(len(pc_darts[0])):
    #     cv2.putText(imgsw, "X", (pc_darts[0][_i] - 10, pc_darts[1][_i] + 10), cv2.FONT_HERSHEY_SIMPLEX,
    #                 1, (0, 255, 0), 2)
    # cv2.imshow('frame', imgsw)

    print([upload_xy[0], upload_xy[1], counter])
    DAI.upload([upload_xy[0], upload_xy[1], counter])

if __name__ == "__main__":
    # video
    path = "http://140.113.110.20:2000"
    cap = cv2.VideoCapture(path)
    # cap = cv2.VideoCapture(0)
    ret, img = cap.read()
    points, i, r, k = locate(img)
    darts = [500,400]
    counter =0
    while (True):
        # 從攝影機擷取一張影像
        ret, img = cap.read()

        # 顯示圖片
        # if (time.time() - st_time) > 1:
        #     print("Hi")
        #     st_time = time.time()
        #     DAI.upload(np.asarray(fig).tolist(), target='img')
        dart_transform(img, darts, counter, points, i, r, k)

        # cv2.imshow('frame', fig)

        # 若按下 q 鍵則離開迴圈
        if cv2.waitKey(10) & 0xFF == ord('q'):
            break

    # 釋放攝影機
    cap.release()

    # 關閉所有 OpenCV 視窗
    cv2.destroyAllWindows()
