import DAI
import cv2
import position_correction as pc



cnt = 0

def click_event(event, x, y, flags, params):
    global cnt, imgsw
    if event == cv2.EVENT_LBUTTONDOWN:
        if cnt%3 == 0:
            imgsw = img.copy()
        cv2.putText(imgsw, "X", (x-10, y+10), cv2.FONT_HERSHEY_SIMPLEX,
                    1, (0, 255, 0), 2)
        cv2.imshow('image', imgsw)
        x += 465.
        y += 138.
        _state = DAI.upload([x,y,cnt])
        print([x,y,cnt])
        cnt += 1

# driver function
if __name__ == "__main__":
    global imgsw
    path = '../dartboard_pic/new_960_720/0_7.jpg'  # Demo 0_7.jpg
    img = cv2.imread(path)
    imgsw = img
    img = pc.get_position_correction_fig(img)
    cv2.imshow('image', img)
    cv2.setMouseCallback('image', click_event)
    cv2.waitKey(0) # wait for a key to be pressed to exit
    cv2.destroyAllWindows() # close the window