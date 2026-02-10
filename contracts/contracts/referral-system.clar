;; Referral System Contract
;; Tracks referrals and manages referral points for BitTask users.

;; Error Constants
(define-constant ERR-UNAUTHORIZED (err u401))
(define-constant ERR-ALREADY-REGISTERED (err u402))
(define-constant ERR-SELF-REFERRAL (err u403))
(define-constant ERR-NOT-FOUND (err u404))

;; Data Maps
;; Map of user to their referrer
(define-map Referrers
    principal ;; User
    principal ;; Referrer
)

;; Map of user to their referral statistics
(define-map ReferralStats
    principal ;; User
    {
        total-referrals: uint,
        total-points: uint,
        multiplier: uint, ;; Multiplier in basis points (10000 = 1x, 15000 = 1.5x)
        last-activity: uint
    }
)

;; Multiplier Tiers (Number of referrals -> Multiplier)
;; Tier 1: 5+ referrals -> 1.1x (11000)
;; Tier 2: 15+ referrals -> 1.25x (12500)
;; Tier 3: 50+ referrals -> 1.5x (15000)
(define-constant MULTIPLIER-BASE u10000)
(define-constant TIER-1-THRESHOLD u5)
(define-constant TIER-1-MULT u11000)
(define-constant TIER-2-THRESHOLD u15)
(define-constant TIER-2-MULT u12500)
(define-constant TIER-3-THRESHOLD u50)
(define-constant TIER-3-MULT u15000)

;; Public Functions

;; @desc Register a referrer for the tx-sender.
;; @param referrer principal - The principal who referred the sender.
(define-public (register-referrer (referrer principal))
    (begin
        ;; Check if already has a referrer
        (asserts! (is-none (map-get? Referrers tx-sender)) ERR-ALREADY-REGISTERED)
        
        ;; Check if not self-referral
        (asserts! (not (is-eq tx-sender referrer)) ERR-SELF-REFERRAL)
        
        ;; Set referrer for sender
        (map-set Referrers tx-sender referrer)
        
        ;; Update stats for referrer
        (let ((stats (default-to { total-referrals: u0, total-points: u0, multiplier: MULTIPLIER-BASE, last-activity: u0 }
                                (map-get? ReferralStats referrer))))
            (let ((new-referrals (+ (get total-referrals stats) u1)))
                (map-set ReferralStats referrer 
                    (merge stats { 
                        total-referrals: new-referrals,
                        multiplier: (calculate-multiplier new-referrals),
                        last-activity: stacks-block-height
                    })
                )
            )
        )
        
        (ok true)
    )
)

;; @desc Add referral points to a user.
;; @param user principal - The user gaining points.
;; @param amount uint - The number of points to add (before multiplier).
(define-public (add-points (user principal) (amount uint))
    (begin
        ;; In a production environment, this would be restricted to authorized contracts
        (let ((stats (default-to { total-referrals: u0, total-points: u0, multiplier: MULTIPLIER-BASE, last-activity: u0 }
                                (map-get? ReferralStats user))))
            (let ((user-multiplier (get multiplier stats))
                  (multiplied-amount (/ (* amount user-multiplier) MULTIPLIER-BASE)))
                (map-set ReferralStats user
                    (merge stats {
                        total-points: (+ (get total-points stats) multiplied-amount),
                        last-activity: stacks-block-height
                    })
                )
                (print { event: "points-added", user: user, amount: multiplied-amount })
                (ok multiplied-amount)
            )
        )
    )
)

;; @desc Claim rewards (placeholder for real reward distribution)
(define-public (claim-rewards)
    (let ((stats (unwrap! (map-get? ReferralStats tx-sender) ERR-NOT-FOUND)))
        (asserts! (> (get total-points stats) u0) ERR-UNAUTHORIZED)
        ;; Reset points after claim (simplified logic)
        (map-set ReferralStats tx-sender (merge stats { total-points: u0 }))
        (print { event: "rewards-claimed", user: tx-sender, points: (get total-points stats) })
        (ok true)
    )
)

;; Private Functions

(define-private (calculate-multiplier (referrals uint))
    (if (>= referrals TIER-3-THRESHOLD)
        TIER-3-MULT
        (if (>= referrals TIER-2-THRESHOLD)
            TIER-2-MULT
            (if (>= referrals TIER-1-THRESHOLD)
                TIER-1-MULT
                MULTIPLIER-BASE
            )
        )
    )
)

;; Read-only functions

;; @desc Get the referrer of a user.
(define-read-only (get-referrer (user principal))
    (map-get? Referrers user)
)

;; @desc Get referral stats for a user.
(define-read-only (get-stats (user principal))
    (default-to { total-referrals: u0, total-points: u0, multiplier: MULTIPLIER-BASE, last-activity: u0 }
                (map-get? ReferralStats user))
)

;; @desc Check if a user is registered as a referrer.
(define-read-only (is-referrer (user principal))
    (is-some (map-get? ReferralStats user))
)
