INSERT INTO `pais`(`nome`, `codigo`, `createdOn`, `updatedOn`) VALUES ('Portugal','351',CURDATE(),CURDATE());
INSERT INTO `pais`(`nome`, `codigo`, `createdOn`, `updatedOn`) VALUES ('Espanha','34',CURDATE(),CURDATE());
INSERT INTO `pais`(`nome`, `codigo`, `createdOn`, `updatedOn`) VALUES ('França','33',CURDATE(),CURDATE());

INSERT INTO `distrito`( `nome`, `createdOn`, `updatedOn`, `codigo_ine`, `id_pais`) VALUES ('Castelo Branco',CURDATE(),CURDATE(),05,1);

INSERT INTO `municipio`(`nome`, `createdOn`, `updatedOn`, `codigo_ine`, `id_distrito`) VALUES ('Covilhã',CURDATE(),CURDATE(),503,1);
INSERT INTO `municipio`(`nome`, `createdOn`, `updatedOn`, `codigo_ine`, `id_distrito`) VALUES ('Fundão',CURDATE(),CURDATE(),504,1);

INSERT INTO `freguesia`(`nome`, `createdOn`, `updatedOn`, `codigo_ine`, `id_municipio`) VALUES ('Covilhã',CURDATE(),CURDATE(),50335,1);
INSERT INTO `freguesia`(`nome`, `createdOn`, `updatedOn`, `codigo_ine`, `id_municipio`) VALUES ('Dominguiso',CURDATE(),CURDATE(),3271,1);

INSERT INTO `morada`(`rua`, `createdOn`, `updatedOn`, `codigo_postal`, `id_freguesia`) VALUES ('Rua Marquês DÁvila e Bolama',CURDATE(),CURDATE(),6200-053,1);


INSERT INTO `fabricante`(`nome`, `modelo`, `createdOn`, `updatedOn`) VALUES ('DJI','Mavic Pro',CURDATE(),CURDATE());

INSERT INTO `drone`(`gama`, `propulsao`, `num_rotores`, `peso`, `alcance_max`, `altitude_max`, `tempo_voo_max`, `tempo_bateria`, `velocidade_max`, `velocidade_ascente`, `velocidade_descendente`, `resistencia_vento`, `temperatura`, `sistema_localizacao`, `tipo_camera`, `comprimento_img`, `largura_img`, `fov`, `resolucao_cam`, `createdOn`, `updatedOn`, `id_fabricante`) VALUES ('MAVIC-PRO', 'Multi-rotor',4,734.00,13.00,5.00,'27','21','18','5','3','10',40,'GPS/GLONASS','GIMBAL',4000,3000,78,'4k',CURDATE(),CURDATE(),1); 