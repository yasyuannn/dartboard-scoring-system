import time, random, requests
import DAN

ServerURL = 'http://6.iottalk.tw:9999'      #with non-secure connection
#ServerURL = 'https://DomainName' #with SSL connection
Reg_addr = None #if None, Reg_addr = MAC address

DAN.profile['dm_name']='dartboard'
DAN.profile['df_list']=['darts_locate', 'img', 'imgO', ]
DAN.profile['d_name']= 'dart_test'

DAN.device_registration_with_retry(ServerURL, Reg_addr)
#DAN.deregister()  #if you want to deregister this device, uncomment this line
#exit()            #if you want to deregister this device, uncomment this line

def upload(data, target='darts_locate'):
    while True:
        try:
            IDF_data = data
            # print(IDF_data)
            DAN.push(target, IDF_data) #Push data to an input device feature "Dummy_Sensor"

            #==================================

            # ODF_data = DAN.pull('Dummy_Control')#Pull data from an output device feature "Dummy_Control"
            # if ODF_data != None:
            #     print (ODF_data[0])
            break

        except Exception as e:
            print(e)
            if str(e).find('mac_addr not found:') != -1:
                print('Reg_addr is not found. Try to re-register...')
                DAN.device_registration_with_retry(ServerURL, Reg_addr)
            else:
                print('Connection failed due to unknow reasons.')
                time.sleep(1)

        time.sleep(0.2)

def download():
    while True:
        try:
            # IDF_data = data
            # # print(IDF_data)
            # DAN.push('darts_locate', IDF_data) #Push data to an input device feature "Dummy_Sensor"
            #
            # #==================================

            ODF_data = DAN.pull('imgO')#Pull data from an output device feature "Dummy_Control"
            if ODF_data != None:
                return(ODF_data[0])
                # break

        except Exception as e:
            print(e)
            if str(e).find('mac_addr not found:') != -1:
                print('Reg_addr is not found. Try to re-register...')
                DAN.device_registration_with_retry(ServerURL, Reg_addr)
            else:
                print('Connection failed due to unknow reasons.')
                time.sleep(1)

        time.sleep(0.2)

if __name__ == "__main__":
    upload("123", target='img')
    print(download())