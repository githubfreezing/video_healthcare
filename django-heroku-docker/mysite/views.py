from django.views.generic import TemplateView
from django.shortcuts import render
from django.http.response import JsonResponse
from django.conf import settings
import json, base64

from django.views.generic import View
import cv2
import json, base64
import numpy as np
from rembg import remove
import os

import torch

class TopView(TemplateView):
    def __init__(self):
        self.params = {
            'user':'',
            'data':'',
            'data_user':'',
            'data_comment_num':[],
        }

    #@login_required
    def get(self,request):
        print('get')
        return render(request,'myapp/home.html',self.params)

    def post(self,request):
        print('post')
        return render(request,'myapp/home.html',self.params)

def ajax_number(request):
    print('post')
    plus = request.POST.get('image')
    d = {
        'plus': plus,
    }
    return JsonResponse(d)

def ResIndex(request):
    if request.method == 'POST':
        print("Res_Index")
        data = request.body.decode('utf-8')
        encoded_data = data.split(',')[1]
        nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        # print("type(image)")#numpy_array
        # print(type(image))
        # print("image.shape")
        # print(image.shape)

        #RGBの変換
        numpy_bgr32 = cv2.cvtColor(image, cv2.COLOR_RGBA2BGRA)

        model = torch.hub.load('ultralytics/yolov5', 'yolov5s')
        #model = torch.hub.load("./yolov5",'yolov5s',source='local')
        results = model(numpy_bgr32)
        print(type(results))

        # coor_0 = int(results.crop()[0]['box'][0])
        # coor_1 = int(results.crop()[0]['box'][1])
        # coor_2 = int(results.crop()[0]['box'][2])
        # coor_3 = int(results.crop()[0]['box'][3])

        # a = cv2.rectangle(image, (coor_0, coor_1), (coor_2, coor_3), (0, 0, 255), thickness = 3)
        # b = cv2.putText(a, results.crop()[0]['label'], (coor_0, coor_1), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 2, cv2.LINE_AA)
        #result, dst_data = cv2.imencode('.png', b)

        a = image 

        for i in range(len(results.crop())):
            results_1_info = results.crop()[i]

            coor_0 = int(results_1_info['box'][0])
            coor_1 = int(results_1_info['box'][1])
            coor_2 = int(results_1_info['box'][2])
            coor_3 = int(results_1_info['box'][3])

            a = cv2.rectangle(a, (coor_0, coor_1 - 30), (coor_0 + 18 * len(results_1_info['label']), coor_1), (0, 0, 255), thickness = -1)
            a = cv2.rectangle(a, (coor_0, coor_1), (coor_2, coor_3), (0, 0, 255), thickness = 3)
            a = cv2.putText(a, results_1_info['label'], (coor_0, coor_1), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

            print("results.crop()[0]['label']")
            print(results.crop()[0]['label'])


        result, dst_data = cv2.imencode('.png', a)
        #result, dst_data = cv2.imencode('.png', results.crop()[0]["im"])

        # image_remove = remove(image)
        # result, dst_data = cv2.imencode('.png', image_remove)

        #result, dst_data = cv2.imencode('.png', image)

        dst_base64 = base64.b64encode(dst_data).decode()

        return JsonResponse({"image": "data:image/png;base64,"+dst_base64})

# def ResIndex(request):
#     if request.method == 'POST':
#         print("Res_Index")
#         data = request.body.decode('utf-8')
#         encoded_data = data.split(',')[1]
#         nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
#         image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#         image_remove = remove(image)
#         result, dst_data = cv2.imencode('.png', image_remove)
#         dst_base64 = base64.b64encode(dst_data).decode()

#         return JsonResponse({"image": "data:image/png;base64,"+dst_base64})
