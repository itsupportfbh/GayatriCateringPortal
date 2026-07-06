using System.Collections.Generic;
using GayatriCateringPortal.Models;

namespace GayatriCateringPortal.Interfaces;

public interface ICommsRepository
{
    List<CommunicationLog> GetAll();
    CommunicationLog? GetById(int id);
    bool Save(CommunicationLog item);
    bool Delete(int id);    bool ActiveInActive(int id);}
