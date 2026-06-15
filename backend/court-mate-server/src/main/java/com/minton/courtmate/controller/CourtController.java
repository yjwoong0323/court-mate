package com.minton.courtmate.controller;

import com.minton.courtmate.dto.CourtCreateReq;
import com.minton.courtmate.dto.CourtRes;
import com.minton.courtmate.service.CourtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courts")
@RequiredArgsConstructor
public class CourtController {

  private final CourtService courtService;

  /**
   * 코트 추가
   */
  @PostMapping
  public ResponseEntity addCourt(@RequestBody CourtCreateReq req) {
    return ResponseEntity.ok(courtService.addCourt(req));
  }

  /**
   * 전체 코트 조회
   */
  @GetMapping
  public ResponseEntity<List<CourtRes>> getAllCourts() {
    return ResponseEntity.ok(courtService.findAll());
  }
}
