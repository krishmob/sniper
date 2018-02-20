import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';
import { createRequestOption } from '../../shared';

import { TaskGroup } from '../task-group/task-group.model';
import { Task } from '../task/task.model';

import {TaskGroupService} from '../task-group/task-group.service';
import {TaskService} from '../task/task.service';

@Injectable()
export class ExtTaskService {

  private resourceUrl =  SERVER_API_URL + 'api/ext/';

  constructor(private http: HttpClient,
              private dateUtils: JhiDateUtils,
              private taskGroupService: TaskGroupService,
              private taskService: TaskService) { }

  /* queryTaskGroupsByDate(req?: any): Observable<HttpResponse<TaskGroup[]>> {
    const options = createRequestOption(req);
    return this.http.get<TaskGroup[]>(this.resourceUrl + 'task-groups', { params: options, observe: 'response' })
        .map((res: HttpResponse<TaskGroup[]>) => this.taskGroupService.convertArrayResponse(res));
  } */

  // get all the taskGroup falling in this date range.
  queryTaskGroupsByDate(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get(this.resourceUrl + 'task-groups', { params: options, observe: 'response' });
  }

  // get all the tasks of taskGroup falling in this date range.
  queryTasksOfTaskGroup(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get(this.resourceUrl + 'tasks-of-task-group', { params: options, observe: 'response' });
        // .map((res: HttpResponse<Task[]>) => this.taskService.convertArrayResponse(res));
  }

  // upload all the files
  // source can be task or taskGroup
  // id can be zero or any id
  // if taskGroup and id is zero, a new taskGroup will be created
  // if task and id is zero, error is thrown
  pushFilesToStorage(source: string, id: number, fileList: FileList): Observable<HttpEvent<{}>> {

    if (fileList.length <= 0) {
      return null;
    }

    const formdata: FormData = new FormData();

    // formdata.append('file', fileList);

    for (let i = 0; i < fileList.length; i++) {
      formdata.append('file[]', fileList.item(i));
    }

    const finalUrl: string = this.resourceUrl + 'uploadFiles/' + source + '/' + id;
    console.log(finalUrl);
    const req = new HttpRequest('POST', finalUrl, formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

}
