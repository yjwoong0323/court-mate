package com.minton.courtmate.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "player")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Player {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @Column(nullable = false)
  private String name;

  @Enumerated(EnumType.STRING)
  @Column(name = "sex", nullable = false)
  private Sex sex;

  @Column(nullable = false)
  private String level;

  @Column(name = "is_attended", nullable = false)
  private Boolean isAttended = true;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "team_id")
  private Team team;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  public enum Sex {
    M, W
  }

  @Builder
  private Player(String name, Sex sex, String level, Team team){
    this.name = name;
    this.sex = sex;
    this.level = level;
    this.team = team;
  }

  public void changeAttendance() {
    this.isAttended = !this.isAttended;
  }
}
