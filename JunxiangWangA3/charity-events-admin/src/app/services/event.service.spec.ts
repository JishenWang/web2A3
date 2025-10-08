import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service'; // 改动1：导入正确服务类

describe('EventService', () => {
  let service: EventService; // 改动2：变量类型匹配

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventService); // 改动3：注入正确服务
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});