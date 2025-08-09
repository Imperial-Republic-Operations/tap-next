-- DropForeignKey
ALTER TABLE `accounts` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `award_tiers` DROP FOREIGN KEY `AwardTier_awardId_fkey`;

-- DropForeignKey
ALTER TABLE `awards` DROP FOREIGN KEY `Award_approvingAuthorityId_fkey`;

-- DropForeignKey
ALTER TABLE `character_awards` DROP FOREIGN KEY `CharacterAward_awardId_fkey`;

-- DropForeignKey
ALTER TABLE `character_awards` DROP FOREIGN KEY `CharacterAward_characterId_fkey`;

-- DropForeignKey
ALTER TABLE `character_career_history` DROP FOREIGN KEY `CharacterPreviousPosition_characterId_fkey`;

-- DropForeignKey
ALTER TABLE `character_education_history` DROP FOREIGN KEY `CharacterEducation_characterId_fkey`;

-- DropForeignKey
ALTER TABLE `character_goals` DROP FOREIGN KEY `CharacterGoal_characterId_fkey`;

-- DropForeignKey
ALTER TABLE `character_honors` DROP FOREIGN KEY `CharacterHonor_characterId_fkey`;

-- DropForeignKey
ALTER TABLE `character_interactions` DROP FOREIGN KEY `CharacterInteraction_characterId_fkey`;

-- DropForeignKey
ALTER TABLE `character_peerages` DROP FOREIGN KEY `Peerage_domainId_fkey`;

-- DropForeignKey
ALTER TABLE `character_peerages` DROP FOREIGN KEY `Peerage_id_fkey`;

-- DropForeignKey
ALTER TABLE `characters` DROP FOREIGN KEY `Character_clearanceId_fkey`;

-- DropForeignKey
ALTER TABLE `characters` DROP FOREIGN KEY `Character_homeworldId_fkey`;

-- DropForeignKey
ALTER TABLE `characters` DROP FOREIGN KEY `Character_speciesId_fkey`;

-- DropForeignKey
ALTER TABLE `characters` DROP FOREIGN KEY `Character_userId_fkey`;

-- DropForeignKey
ALTER TABLE `code_gen` DROP FOREIGN KEY `CodeGen_characterId_fkey`;

-- DropForeignKey
ALTER TABLE `code_gen` DROP FOREIGN KEY `CodeGen_documentId_fkey`;

-- DropForeignKey
ALTER TABLE `code_gen` DROP FOREIGN KEY `CodeGen_userId_fkey`;

-- DropForeignKey
ALTER TABLE `credit_accounts` DROP FOREIGN KEY `CreditAccount_characterId_fkey`;

-- DropForeignKey
ALTER TABLE `credit_accounts` DROP FOREIGN KEY `CreditAccount_organizationId_fkey`;

-- DropForeignKey
ALTER TABLE `credit_transfers` DROP FOREIGN KEY `CreditTransfer_recipientId_fkey`;

-- DropForeignKey
ALTER TABLE `credit_transfers` DROP FOREIGN KEY `CreditTransfer_senderId_fkey`;

-- DropForeignKey
ALTER TABLE `document_sequences` DROP FOREIGN KEY `DocumentSequence_organizationId_fkey`;

-- DropForeignKey
ALTER TABLE `document_sequences` DROP FOREIGN KEY `DocumentSequence_typeId_fkey`;

-- DropForeignKey
ALTER TABLE `force_profiles` DROP FOREIGN KEY `ForceProfile_id_fkey`;

-- DropForeignKey
ALTER TABLE `force_profiles` DROP FOREIGN KEY `ForceProfile_masterId_fkey`;

-- DropForeignKey
ALTER TABLE `force_profiles` DROP FOREIGN KEY `ForceProfile_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `force_titles` DROP FOREIGN KEY `ForceTitle_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `force_training_sessions` DROP FOREIGN KEY `TrainingSession_abilityId_fkey`;

-- DropForeignKey
ALTER TABLE `force_training_sessions` DROP FOREIGN KEY `TrainingSession_characterId_fkey`;

-- DropForeignKey
ALTER TABLE `game_documents` DROP FOREIGN KEY `GameDocument_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `game_documents` DROP FOREIGN KEY `GameDocument_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `high_council_settings` DROP FOREIGN KEY `HighCouncilSettings_chairmanPositionId_fkey`;

-- DropForeignKey
ALTER TABLE `high_council_settings` DROP FOREIGN KEY `HighCouncilSettings_highCouncilorPositionId_fkey`;

-- DropForeignKey
ALTER TABLE `high_council_settings` DROP FOREIGN KEY `HighCouncilSettings_honoraryHighCouncilorPositionId_fkey`;

-- DropForeignKey
ALTER TABLE `high_council_settings` DROP FOREIGN KEY `HighCouncilSettings_viceChairmanPositionId_fkey`;

-- DropForeignKey
ALTER TABLE `inventories` DROP FOREIGN KEY `Inventory_characterId_fkey`;

-- DropForeignKey
ALTER TABLE `inventories` DROP FOREIGN KEY `Inventory_organizationId_fkey`;

-- DropForeignKey
ALTER TABLE `inventory_transfer_items` DROP FOREIGN KEY `InventoryTransferItem_itemId_fkey`;

-- DropForeignKey
ALTER TABLE `inventory_transfer_items` DROP FOREIGN KEY `InventoryTransferItem_shipId_fkey`;

-- DropForeignKey
ALTER TABLE `inventory_transfer_items` DROP FOREIGN KEY `InventoryTransferItem_transferId_fkey`;

-- DropForeignKey
ALTER TABLE `inventory_transfer_items` DROP FOREIGN KEY `InventoryTransferItem_vehicleId_fkey`;

-- DropForeignKey
ALTER TABLE `inventory_transfers` DROP FOREIGN KEY `InventoryTransfer_recipientId_fkey`;

-- DropForeignKey
ALTER TABLE `inventory_transfers` DROP FOREIGN KEY `InventoryTransfer_senderId_fkey`;

-- DropForeignKey
ALTER TABLE `items` DROP FOREIGN KEY `Item_inventoryId_fkey`;

-- DropForeignKey
ALTER TABLE `items` DROP FOREIGN KEY `Item_modelId_fkey`;

-- DropForeignKey
ALTER TABLE `memberships` DROP FOREIGN KEY `Member_characterId_fkey`;

-- DropForeignKey
ALTER TABLE `memberships` DROP FOREIGN KEY `Member_organizationId_fkey`;

-- DropForeignKey
ALTER TABLE `memberships` DROP FOREIGN KEY `Member_positionId_fkey`;

-- DropForeignKey
ALTER TABLE `memberships` DROP FOREIGN KEY `Member_rankId_fkey`;

-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `Notification_userId_fkey`;

-- DropForeignKey
ALTER TABLE `organization_documents` DROP FOREIGN KEY `OrganizationDocument_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `organization_documents` DROP FOREIGN KEY `OrganizationDocument_listClearanceId_fkey`;

-- DropForeignKey
ALTER TABLE `organization_documents` DROP FOREIGN KEY `OrganizationDocument_organizationId_fkey`;

-- DropForeignKey
ALTER TABLE `organization_documents` DROP FOREIGN KEY `OrganizationDocument_typeId_fkey`;

-- DropForeignKey
ALTER TABLE `organization_documents` DROP FOREIGN KEY `OrganizationDocument_viewClearanceId_fkey`;

-- DropForeignKey
ALTER TABLE `organizations` DROP FOREIGN KEY `Organization_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `personal_documents` DROP FOREIGN KEY `PersonalDocument_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `planets` DROP FOREIGN KEY `Planet_systemId_fkey`;

-- DropForeignKey
ALTER TABLE `position_permissions` DROP FOREIGN KEY `PositionPermission_positionId_fkey`;

-- DropForeignKey
ALTER TABLE `positions` DROP FOREIGN KEY `Position_organizationId_fkey`;

-- DropForeignKey
ALTER TABLE `ranks` DROP FOREIGN KEY `Rank_organizationId_fkey`;

-- DropForeignKey
ALTER TABLE `sectors` DROP FOREIGN KEY `Sector_oversectorId_fkey`;

-- DropForeignKey
ALTER TABLE `senate_committees` DROP FOREIGN KEY `SenateCommittee_chairId_fkey`;

-- DropForeignKey
ALTER TABLE `senate_committees` DROP FOREIGN KEY `SenateCommittee_viceChairId_fkey`;

-- DropForeignKey
ALTER TABLE `senate_settings` DROP FOREIGN KEY `SenateSettings_presidentPositionId_fkey`;

-- DropForeignKey
ALTER TABLE `senate_settings` DROP FOREIGN KEY `SenateSettings_supremeRulerPositionId_fkey`;

-- DropForeignKey
ALTER TABLE `senate_settings` DROP FOREIGN KEY `SenateSettings_vicePresidentPositionId_fkey`;

-- DropForeignKey
ALTER TABLE `senators` DROP FOREIGN KEY `Senator_committeeId_fkey`;

-- DropForeignKey
ALTER TABLE `senators` DROP FOREIGN KEY `Senator_planetId_fkey`;

-- DropForeignKey
ALTER TABLE `senators` DROP FOREIGN KEY `Senator_userId_fkey`;

-- DropForeignKey
ALTER TABLE `sessions` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropForeignKey
ALTER TABLE `ships` DROP FOREIGN KEY `Ship_inventoryId_fkey`;

-- DropForeignKey
ALTER TABLE `ships` DROP FOREIGN KEY `Ship_modelId_fkey`;

-- DropForeignKey
ALTER TABLE `systems` DROP FOREIGN KEY `System_sectorId_fkey`;

-- DropForeignKey
ALTER TABLE `teams` DROP FOREIGN KEY `Team_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `teams_settings` DROP FOREIGN KEY `TeamsSettings_characterTeamId_fkey`;

-- DropForeignKey
ALTER TABLE `teams_settings` DROP FOREIGN KEY `TeamsSettings_forceTeamId_fkey`;

-- DropForeignKey
ALTER TABLE `teams_settings` DROP FOREIGN KEY `TeamsSettings_moderationTeamId_fkey`;

-- DropForeignKey
ALTER TABLE `teams_settings` DROP FOREIGN KEY `TeamsSettings_operationsTeamId_fkey`;

-- DropForeignKey
ALTER TABLE `teams_settings` DROP FOREIGN KEY `TeamsSettings_publicationTeamId_fkey`;

-- DropForeignKey
ALTER TABLE `user_settings` DROP FOREIGN KEY `UserSettings_defaultCharacterId_fkey`;

-- DropForeignKey
ALTER TABLE `user_settings` DROP FOREIGN KEY `UserSettings_userId_fkey`;

-- DropForeignKey
ALTER TABLE `vehicles` DROP FOREIGN KEY `Vehicle_inventoryId_fkey`;

-- DropForeignKey
ALTER TABLE `vehicles` DROP FOREIGN KEY `Vehicle_modelId_fkey`;

-- AddForeignKey
ALTER TABLE `user_settings` ADD CONSTRAINT `user_settings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_settings` ADD CONSTRAINT `user_settings_defaultCharacterId_fkey` FOREIGN KEY (`defaultCharacterId`) REFERENCES `characters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teams` ADD CONSTRAINT `teams_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organizations` ADD CONSTRAINT `organizations_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `organizations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ranks` ADD CONSTRAINT `ranks_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `positions` ADD CONSTRAINT `positions_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `position_permissions` ADD CONSTRAINT `position_permissions_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `positions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `memberships` ADD CONSTRAINT `memberships_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `characters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `memberships` ADD CONSTRAINT `memberships_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `memberships` ADD CONSTRAINT `memberships_rankId_fkey` FOREIGN KEY (`rankId`) REFERENCES `ranks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `memberships` ADD CONSTRAINT `memberships_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `positions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `characters` ADD CONSTRAINT `characters_speciesId_fkey` FOREIGN KEY (`speciesId`) REFERENCES `species`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `characters` ADD CONSTRAINT `characters_homeworldId_fkey` FOREIGN KEY (`homeworldId`) REFERENCES `planets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `characters` ADD CONSTRAINT `characters_clearanceId_fkey` FOREIGN KEY (`clearanceId`) REFERENCES `security_clearances`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `characters` ADD CONSTRAINT `characters_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `character_interactions` ADD CONSTRAINT `character_interactions_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `characters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `character_career_history` ADD CONSTRAINT `character_career_history_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `characters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `character_education_history` ADD CONSTRAINT `character_education_history_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `characters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `character_honors` ADD CONSTRAINT `character_honors_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `characters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `character_goals` ADD CONSTRAINT `character_goals_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `characters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `character_peerages` ADD CONSTRAINT `character_peerages_id_fkey` FOREIGN KEY (`id`) REFERENCES `characters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `character_peerages` ADD CONSTRAINT `character_peerages_domainId_fkey` FOREIGN KEY (`domainId`) REFERENCES `planets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sectors` ADD CONSTRAINT `sectors_oversectorId_fkey` FOREIGN KEY (`oversectorId`) REFERENCES `oversectors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `systems` ADD CONSTRAINT `systems_sectorId_fkey` FOREIGN KEY (`sectorId`) REFERENCES `sectors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `planets` ADD CONSTRAINT `planets_systemId_fkey` FOREIGN KEY (`systemId`) REFERENCES `systems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `force_profiles` ADD CONSTRAINT `force_profiles_id_fkey` FOREIGN KEY (`id`) REFERENCES `characters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `force_profiles` ADD CONSTRAINT `force_profiles_masterId_fkey` FOREIGN KEY (`masterId`) REFERENCES `characters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `force_profiles` ADD CONSTRAINT `force_profiles_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `force_orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `force_titles` ADD CONSTRAINT `force_titles_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `force_orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `force_training_sessions` ADD CONSTRAINT `force_training_sessions_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `characters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `force_training_sessions` ADD CONSTRAINT `force_training_sessions_abilityId_fkey` FOREIGN KEY (`abilityId`) REFERENCES `force_abilities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `code_gen` ADD CONSTRAINT `code_gen_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `code_gen` ADD CONSTRAINT `code_gen_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `characters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `code_gen` ADD CONSTRAINT `code_gen_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `game_documents`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_documents` ADD CONSTRAINT `game_documents_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_documents` ADD CONSTRAINT `game_documents_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_documents` ADD CONSTRAINT `organization_documents_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `characters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_documents` ADD CONSTRAINT `organization_documents_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_documents` ADD CONSTRAINT `organization_documents_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `document_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_documents` ADD CONSTRAINT `organization_documents_listClearanceId_fkey` FOREIGN KEY (`listClearanceId`) REFERENCES `security_clearances`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_documents` ADD CONSTRAINT `organization_documents_viewClearanceId_fkey` FOREIGN KEY (`viewClearanceId`) REFERENCES `security_clearances`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `personal_documents` ADD CONSTRAINT `personal_documents_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `characters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_sequences` ADD CONSTRAINT `document_sequences_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `document_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_sequences` ADD CONSTRAINT `document_sequences_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `credit_accounts` ADD CONSTRAINT `credit_accounts_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `characters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `credit_accounts` ADD CONSTRAINT `credit_accounts_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `characters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_modelId_fkey` FOREIGN KEY (`modelId`) REFERENCES `item_models`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ships` ADD CONSTRAINT `ships_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ships` ADD CONSTRAINT `ships_modelId_fkey` FOREIGN KEY (`modelId`) REFERENCES `ship_models`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_modelId_fkey` FOREIGN KEY (`modelId`) REFERENCES `vehicle_models`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `credit_transfers` ADD CONSTRAINT `credit_transfers_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `credit_accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `credit_transfers` ADD CONSTRAINT `credit_transfers_recipientId_fkey` FOREIGN KEY (`recipientId`) REFERENCES `credit_accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_transfers` ADD CONSTRAINT `inventory_transfers_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `inventories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_transfers` ADD CONSTRAINT `inventory_transfers_recipientId_fkey` FOREIGN KEY (`recipientId`) REFERENCES `inventories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_transfer_items` ADD CONSTRAINT `inventory_transfer_items_transferId_fkey` FOREIGN KEY (`transferId`) REFERENCES `inventory_transfers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_transfer_items` ADD CONSTRAINT `inventory_transfer_items_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `items`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_transfer_items` ADD CONSTRAINT `inventory_transfer_items_shipId_fkey` FOREIGN KEY (`shipId`) REFERENCES `ships`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_transfer_items` ADD CONSTRAINT `inventory_transfer_items_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `awards` ADD CONSTRAINT `awards_approvingAuthorityId_fkey` FOREIGN KEY (`approvingAuthorityId`) REFERENCES `organizations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `award_tiers` ADD CONSTRAINT `award_tiers_awardId_fkey` FOREIGN KEY (`awardId`) REFERENCES `awards`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `character_awards` ADD CONSTRAINT `character_awards_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `characters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `character_awards` ADD CONSTRAINT `character_awards_awardId_fkey` FOREIGN KEY (`awardId`) REFERENCES `award_tiers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `senators` ADD CONSTRAINT `senators_planetId_fkey` FOREIGN KEY (`planetId`) REFERENCES `planets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `senators` ADD CONSTRAINT `senators_committeeId_fkey` FOREIGN KEY (`committeeId`) REFERENCES `senate_committees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `senators` ADD CONSTRAINT `senators_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `senate_committees` ADD CONSTRAINT `senate_committees_chairId_fkey` FOREIGN KEY (`chairId`) REFERENCES `senators`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `senate_committees` ADD CONSTRAINT `senate_committees_viceChairId_fkey` FOREIGN KEY (`viceChairId`) REFERENCES `senators`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teams_settings` ADD CONSTRAINT `teams_settings_characterTeamId_fkey` FOREIGN KEY (`characterTeamId`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teams_settings` ADD CONSTRAINT `teams_settings_moderationTeamId_fkey` FOREIGN KEY (`moderationTeamId`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teams_settings` ADD CONSTRAINT `teams_settings_forceTeamId_fkey` FOREIGN KEY (`forceTeamId`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teams_settings` ADD CONSTRAINT `teams_settings_operationsTeamId_fkey` FOREIGN KEY (`operationsTeamId`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teams_settings` ADD CONSTRAINT `teams_settings_publicationTeamId_fkey` FOREIGN KEY (`publicationTeamId`) REFERENCES `teams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `senate_settings` ADD CONSTRAINT `senate_settings_supremeRulerPositionId_fkey` FOREIGN KEY (`supremeRulerPositionId`) REFERENCES `positions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `senate_settings` ADD CONSTRAINT `senate_settings_presidentPositionId_fkey` FOREIGN KEY (`presidentPositionId`) REFERENCES `positions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `senate_settings` ADD CONSTRAINT `senate_settings_vicePresidentPositionId_fkey` FOREIGN KEY (`vicePresidentPositionId`) REFERENCES `positions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `high_council_settings` ADD CONSTRAINT `high_council_settings_chairmanPositionId_fkey` FOREIGN KEY (`chairmanPositionId`) REFERENCES `positions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `high_council_settings` ADD CONSTRAINT `high_council_settings_viceChairmanPositionId_fkey` FOREIGN KEY (`viceChairmanPositionId`) REFERENCES `positions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `high_council_settings` ADD CONSTRAINT `high_council_settings_highCouncilorPositionId_fkey` FOREIGN KEY (`highCouncilorPositionId`) REFERENCES `positions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `high_council_settings` ADD CONSTRAINT `high_council_settings_honoraryHighCouncilorPositionId_fkey` FOREIGN KEY (`honoraryHighCouncilorPositionId`) REFERENCES `positions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `accounts` RENAME INDEX `Account_provider_providerAccountId_key` TO `accounts_provider_providerAccountId_key`;

-- RenameIndex
ALTER TABLE `accounts` RENAME INDEX `Account_userId_idx` TO `accounts_userId_idx`;

-- RenameIndex
ALTER TABLE `calendar_months` RENAME INDEX `Month_realMonth_key` TO `calendar_months_realMonth_key`;

-- RenameIndex
ALTER TABLE `calendar_years` RENAME INDEX `Year_gameYear_era_key` TO `calendar_years_gameYear_era_key`;

-- RenameIndex
ALTER TABLE `character_peerages` RENAME INDEX `Peerage_domainId_key` TO `character_peerages_domainId_key`;

-- RenameIndex
ALTER TABLE `characters` RENAME INDEX `Character_name_key` TO `characters_name_key`;

-- RenameIndex
ALTER TABLE `code_gen` RENAME INDEX `CodeGen_documentId_key` TO `code_gen_documentId_key`;

-- RenameIndex
ALTER TABLE `credit_accounts` RENAME INDEX `CreditAccount_characterId_key` TO `credit_accounts_characterId_key`;

-- RenameIndex
ALTER TABLE `credit_accounts` RENAME INDEX `CreditAccount_organizationId_key` TO `credit_accounts_organizationId_key`;

-- RenameIndex
ALTER TABLE `credit_accounts` RENAME INDEX `CreditAccount_type_accountNumber_key` TO `credit_accounts_type_accountNumber_key`;

-- RenameIndex
ALTER TABLE `document_types` RENAME INDEX `DocumentType_name_key` TO `document_types_name_key`;

-- RenameIndex
ALTER TABLE `force_abilities` RENAME INDEX `ForceAbility_name_key` TO `force_abilities_name_key`;

-- RenameIndex
ALTER TABLE `force_orders` RENAME INDEX `ForceOrder_name_key` TO `force_orders_name_key`;

-- RenameIndex
ALTER TABLE `force_titles` RENAME INDEX `ForceTitle_level_orderId_key` TO `force_titles_level_orderId_key`;

-- RenameIndex
ALTER TABLE `high_council_settings` RENAME INDEX `HighCouncilSettings_chairmanPositionId_key` TO `high_council_settings_chairmanPositionId_key`;

-- RenameIndex
ALTER TABLE `high_council_settings` RENAME INDEX `HighCouncilSettings_highCouncilorPositionId_key` TO `high_council_settings_highCouncilorPositionId_key`;

-- RenameIndex
ALTER TABLE `high_council_settings` RENAME INDEX `HighCouncilSettings_honoraryHighCouncilorPositionId_key` TO `high_council_settings_honoraryHighCouncilorPositionId_key`;

-- RenameIndex
ALTER TABLE `high_council_settings` RENAME INDEX `HighCouncilSettings_viceChairmanPositionId_key` TO `high_council_settings_viceChairmanPositionId_key`;

-- RenameIndex
ALTER TABLE `inventories` RENAME INDEX `Inventory_characterId_key` TO `inventories_characterId_key`;

-- RenameIndex
ALTER TABLE `inventories` RENAME INDEX `Inventory_organizationId_key` TO `inventories_organizationId_key`;

-- RenameIndex
ALTER TABLE `memberships` RENAME INDEX `Member_characterId_organizationId_key` TO `memberships_characterId_organizationId_key`;

-- RenameIndex
ALTER TABLE `organizations` RENAME INDEX `Organization_name_parentId_key` TO `organizations_name_parentId_key`;

-- RenameIndex
ALTER TABLE `oversectors` RENAME INDEX `Oversector_name_key` TO `oversectors_name_key`;

-- RenameIndex
ALTER TABLE `planets` RENAME INDEX `Planet_name_key` TO `planets_name_key`;

-- RenameIndex
ALTER TABLE `positions` RENAME INDEX `Position_name_organizationId_key` TO `positions_name_organizationId_key`;

-- RenameIndex
ALTER TABLE `ranks` RENAME INDEX `Rank_name_organizationId_key` TO `ranks_name_organizationId_key`;

-- RenameIndex
ALTER TABLE `sectors` RENAME INDEX `Sector_name_key` TO `sectors_name_key`;

-- RenameIndex
ALTER TABLE `security_clearances` RENAME INDEX `SecurityClearance_name_key` TO `security_clearances_name_key`;

-- RenameIndex
ALTER TABLE `senate_committees` RENAME INDEX `SenateCommittee_chairId_key` TO `senate_committees_chairId_key`;

-- RenameIndex
ALTER TABLE `senate_committees` RENAME INDEX `SenateCommittee_viceChairId_key` TO `senate_committees_viceChairId_key`;

-- RenameIndex
ALTER TABLE `senate_settings` RENAME INDEX `SenateSettings_presidentPositionId_key` TO `senate_settings_presidentPositionId_key`;

-- RenameIndex
ALTER TABLE `senate_settings` RENAME INDEX `SenateSettings_supremeRulerPositionId_key` TO `senate_settings_supremeRulerPositionId_key`;

-- RenameIndex
ALTER TABLE `senate_settings` RENAME INDEX `SenateSettings_vicePresidentPositionId_key` TO `senate_settings_vicePresidentPositionId_key`;

-- RenameIndex
ALTER TABLE `senators` RENAME INDEX `Senator_userId_key` TO `senators_userId_key`;

-- RenameIndex
ALTER TABLE `sessions` RENAME INDEX `Session_sessionToken_key` TO `sessions_sessionToken_key`;

-- RenameIndex
ALTER TABLE `sessions` RENAME INDEX `Session_userId_idx` TO `sessions_userId_idx`;

-- RenameIndex
ALTER TABLE `species` RENAME INDEX `Species_name_key` TO `species_name_key`;

-- RenameIndex
ALTER TABLE `systems` RENAME INDEX `System_name_key` TO `systems_name_key`;

-- RenameIndex
ALTER TABLE `teams` RENAME INDEX `Team_abbreviation_key` TO `teams_abbreviation_key`;

-- RenameIndex
ALTER TABLE `teams` RENAME INDEX `Team_adminId_key` TO `teams_adminId_key`;

-- RenameIndex
ALTER TABLE `teams` RENAME INDEX `Team_name_key` TO `teams_name_key`;

-- RenameIndex
ALTER TABLE `teams_settings` RENAME INDEX `TeamsSettings_characterTeamId_key` TO `teams_settings_characterTeamId_key`;

-- RenameIndex
ALTER TABLE `teams_settings` RENAME INDEX `TeamsSettings_forceTeamId_key` TO `teams_settings_forceTeamId_key`;

-- RenameIndex
ALTER TABLE `teams_settings` RENAME INDEX `TeamsSettings_moderationTeamId_key` TO `teams_settings_moderationTeamId_key`;

-- RenameIndex
ALTER TABLE `teams_settings` RENAME INDEX `TeamsSettings_operationsTeamId_key` TO `teams_settings_operationsTeamId_key`;

-- RenameIndex
ALTER TABLE `teams_settings` RENAME INDEX `TeamsSettings_publicationTeamId_key` TO `teams_settings_publicationTeamId_key`;

-- RenameIndex
ALTER TABLE `user_settings` RENAME INDEX `UserSettings_defaultCharacterId_key` TO `user_settings_defaultCharacterId_key`;

-- RenameIndex
ALTER TABLE `user_settings` RENAME INDEX `UserSettings_userId_key` TO `user_settings_userId_key`;

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `User_email_key` TO `users_email_key`;

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `User_nexusId_key` TO `users_nexusId_key`;

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `User_username_key` TO `users_username_key`;

-- RenameIndex
ALTER TABLE `verification_tokens` RENAME INDEX `VerificationToken_identifier_token_key` TO `verification_tokens_identifier_token_key`;
